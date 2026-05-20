local utils = {}

-- Accent colour for 3D connecting line and dot
local ACCENT     = { r = 161, g = 159, b = 251, a = 220 }
local DOT_COLOUR = { r = 161, g = 159, b = 251, a = 255 }
local LINE_STYLE = 'l-shape'

local function hexToRgb(hex)
    if not hex then return 161, 159, 251 end
    hex = hex:gsub("#", "")
    local r = tonumber(hex:sub(1, 2), 16) or 161
    local g = tonumber(hex:sub(3, 4), 16) or 159
    local b = tonumber(hex:sub(5, 6), 16) or 251
    return r, g, b
end

function utils.updateSettings(settings)
    if not settings then return end

    if settings.accentColor then
        local r, g, b = hexToRgb(settings.accentColor)
        ACCENT.r, ACCENT.g, ACCENT.b = r, g, b
        DOT_COLOUR.r, DOT_COLOUR.g, DOT_COLOUR.b = r, g, b
    end

    if settings.lineStyle then
        LINE_STYLE = settings.lineStyle
    end
end

local GetWorldCoordFromScreenCoord = GetWorldCoordFromScreenCoord
local StartShapeTestLosProbe       = StartShapeTestLosProbe
local GetShapeTestResultIncludingMaterial = GetShapeTestResultIncludingMaterial
local SetDrawOrigin    = SetDrawOrigin
local DrawSprite       = DrawSprite
local ClearDrawOrigin  = ClearDrawOrigin
local DrawLine         = DrawLine
local DrawMarker       = DrawMarker
local GetAspectRatio   = GetAspectRatio
local GetScreenCoordFromWorldCoord = GetScreenCoordFromWorldCoord

-- ─── World-to-Screen NUI positioning system ────────────────────────────────
-- Instead of DUI textures (server version incompatible), we:
--   1. Get the entity's 2D screen position each frame via GetScreenCoordFromWorldCoord
--   2. Send it to the NUI overlay so the card renders exactly above the entity
--   3. Draw a 3D line from the entity base to the card anchor in world space

--- Activate the world-anchored menu
---@param entityCoords vector3
---@param flatOptionList table  {icon, label, hide}[]
function utils.showDui(entityCoords, flatOptionList)
    utils.duiCoords  = entityCoords
    utils.duiVisible = true
    -- Send the options list so the NUI card populates
    SendNuiMessage(json.encode({
        event   = 'setWorldTarget',
        options = flatOptionList,
    }))
end

--- Deactivate the world-anchored menu
function utils.hideDui()
    utils.duiVisible = false
    utils.duiCoords  = nil
    SendNuiMessage('{"event":"clearWorldTarget"}')
end

--- Called every frame from the render thread.
--- Draws the 3D line/dot in world space and pushes screen-space position
--- to the NUI so the card follows the entity.
function utils.drawDui()
    if not utils.duiVisible or not utils.duiCoords then return end

    local origin  = utils.duiCoords
    
    -- Get player vectors for perspective-based offsets
    local right, forward, up, p = GetEntityMatrix(cache.ped)
    
    -- Add a tiny offset towards the camera so the line doesn't start INSIDE a prop/wall
    local dotPos = origin - (forward * 0.05)
    
    local offsetDistance = 0.65 -- Wider side line
    local verticalHeight = 0.85 -- Slightly taller for premium look
    
    local jointPos = dotPos + (right * offsetDistance)
    local cardPos  = jointPos + (up * verticalHeight)

    -- Draw lines based on style
    if LINE_STYLE == 'l-shape' then
        -- 1. Horizontal segment: __
        DrawLine(
            dotPos.x, dotPos.y, dotPos.z,
            jointPos.x, jointPos.y, jointPos.z,
            ACCENT.r, ACCENT.g, ACCENT.b, ACCENT.a
        )
        -- 2. Vertical segment: |
        DrawLine(
            jointPos.x, jointPos.y, jointPos.z,
            cardPos.x, cardPos.y, cardPos.z,
            ACCENT.r, ACCENT.g, ACCENT.b, ACCENT.a
        )
    elseif LINE_STYLE == 'straight' then
        -- Direct connection line
        DrawLine(
            dotPos.x, dotPos.y, dotPos.z,
            cardPos.x, cardPos.y, cardPos.z,
            ACCENT.r, ACCENT.g, ACCENT.b, ACCENT.a
        )
    end

    -- Draw Dot if style is not 'none'
    if LINE_STYLE ~= 'none' then
        DrawMarker(
            0,
            dotPos.x, dotPos.y, dotPos.z,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.04, 0.04, 0.04,
            DOT_COLOUR.r, DOT_COLOUR.g, DOT_COLOUR.b, DOT_COLOUR.a,
            false, false, 2, false, nil, nil, false
        )
    end

    -- Projection for NUI positioning
    local onScreen, sx, sy = GetScreenCoordFromWorldCoord(cardPos.x, cardPos.y, cardPos.z)

    if onScreen then
        SendNuiMessage(json.encode({
            event = 'worldPosition',
            x     = sx,
            y     = sy,
        }))
    end
end

-- ─── Existing helpers (unchanged) ─────────────────────────────────────────────

---@param flag number
---@return boolean hit
---@return number entityHit
---@return vector3 endCoords
---@return vector3 surfaceNormal
---@return number materialHash
function utils.raycastFromCamera(flag)
    local coords, normal = GetWorldCoordFromScreenCoord(0.5, 0.5)
    local destination = coords + normal * 10
    local handle = StartShapeTestLosProbe(coords.x, coords.y, coords.z, destination.x, destination.y, destination.z,
        flag, cache.ped, 4)

    while true do
        Wait(0)
        local retval, hit, endCoords, surfaceNormal, materialHash, entityHit = GetShapeTestResultIncludingMaterial(handle)
        if retval ~= 1 then
            ---@diagnostic disable-next-line: return-type-mismatch
            return hit, entityHit, endCoords, surfaceNormal, materialHash
        end
    end
end

function utils.getTexture()
    return lib.requestStreamedTextureDict('shared'), 'emptydot_32'
end

local drawZoneSprites = GetConvarInt('ox_target:drawSprite', 24)
local colour = vector(155, 155, 155, 175)
local hover   = vector(98, 135, 236, 255)
local currentZones  = {}
local previousZones = {}
local drawZones = {}
local drawN = 0
local width = 0.02
local height = width * GetAspectRatio(false)

if drawZoneSprites == 0 then drawZoneSprites = -1 end

---@param coords vector3
---@return CZone[], boolean
function utils.getNearbyZones(coords)
    if not Zones then return currentZones, false end

    local n = 0
    local nearbyZones = lib.zones.getNearbyZones()
    drawN = 0
    previousZones, currentZones = currentZones, table.wipe(previousZones)

    for i = 1, #nearbyZones do
        local zone = nearbyZones[i]
        local contains = zone:contains(coords)

        if contains then
            n += 1
            currentZones[n] = zone
        end

        if drawN <= drawZoneSprites and zone.drawSprite ~= false and (contains or (zone.distance or 7) < 7) then
            drawN += 1
            drawZones[drawN] = zone
            zone.colour = contains and hover or nil
        end
    end

    local previousN = #previousZones

    if n ~= previousN then
        return currentZones, true
    end

    if n > 0 then
        for i = 1, n do
            local zoneA = currentZones[i]
            local found = false

            for j = 1, previousN do
                local zoneB = previousZones[j]
                if zoneA == zoneB then
                    found = true
                    break
                end
            end

            if not found then
                return currentZones, true
            end
        end
    end

    return currentZones, false
end

function utils.drawZoneSprites(dict, texture)
    if drawN == 0 then return end

    for i = 1, drawN do
        local zone = drawZones[i]
        local spriteColour = zone.colour or colour

        if zone.drawSprite ~= false then
            SetDrawOrigin(zone.coords.x, zone.coords.y, zone.coords.z)
            DrawSprite(dict, texture, 0, 0, width, height, 0, spriteColour.r, spriteColour.g, spriteColour.b, spriteColour.a)
        end
    end

    ClearDrawOrigin()
end

function utils.hasExport(export)
    local resource, exportName = string.strsplit('.', export)
    return pcall(function()
        return exports[resource][exportName]
    end)
end

local playerItems = {}

function utils.getItems()
    return playerItems
end

---@param filter string | string[] | table<string, number>
---@param hasAny boolean?
---@return boolean
function utils.hasPlayerGotItems(filter, hasAny)
    if not playerItems then return true end

    local _type = type(filter)

    if _type == 'string' then
        return (playerItems[filter] or 0) > 0
    elseif _type == 'table' then
        local tabletype = table.type(filter)

        if tabletype == 'hash' then
            for name, amount in pairs(filter) do
                local hasItem = (playerItems[name] or 0) >= amount
                if hasAny then
                    if hasItem then return true end
                elseif not hasItem then
                    return false
                end
            end
        elseif tabletype == 'array' then
            for i = 1, #filter do
                local hasItem = (playerItems[filter[i]] or 0) > 0
                if hasAny then
                    if hasItem then return true end
                elseif not hasItem then
                    return false
                end
            end
        end
    end

    return not hasAny
end

---stub
---@param filter string | string[] | table<string, number>
---@return boolean
function utils.hasPlayerGotGroup(filter)
    return true
end

SetTimeout(0, function()
    if utils.hasExport('ox_inventory.Items') then
        setmetatable(playerItems, {
            __index = function(self, index)
                self[index] = exports.ox_inventory:Search('count', index) or 0
                return self[index]
            end
        })

        AddEventHandler('ox_inventory:itemCount', function(name, count)
            playerItems[name] = count
        end)
    end

    if utils.hasExport('ox_core.GetPlayer') then
        require 'client.framework.ox'
    elseif utils.hasExport('es_extended.getSharedObject') then
        require 'client.framework.esx'
    elseif utils.hasExport('qbx_core.HasGroup') then
        require 'client.framework.qbx'
    elseif utils.hasExport('ND_Core.getPlayer') then
        require 'client.framework.nd'
    end
end)

function utils.warn(msg)
    local trace = Citizen.InvokeNative(`FORMAT_STACK_TRACE` & 0xFFFFFFFF, nil, 0, Citizen.ResultAsString())
    local _, _, src = string.strsplit('\n', trace, 4)
    warn(('%s ^0%s\n'):format(msg, src:gsub(".-%(",  '(')))
end

return utils
