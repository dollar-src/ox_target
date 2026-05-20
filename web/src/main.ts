import { createOptions } from "./createOptions";
import { NuiMessageData, UISettings } from "./types";
import { SettingsManager } from "./settings";
import { UIBuilder } from "./ui";
import { fetchNui } from "./fetchNui";

UIBuilder.buildApp();

const settings = new SettingsManager();
fetchNui("updateSettings", settings.current).catch(() => { });

const optionsWrapper = document.getElementById("options-wrapper") as HTMLDivElement;
const menuCard = document.getElementById("menu-card") as HTMLDivElement;
const centerCursor = document.getElementById("center-cursor") as HTMLDivElement;
const settingsContainer = document.getElementById("settings-container") as HTMLDivElement;
const cardHeader = document.getElementById("card-header") as HTMLDivElement;
const backButton = document.getElementById("back-button") as HTMLDivElement;
const body = document.body;

let menuHistory: any[][] = [];
let currentMenuOptions: any[] = [];

window.addEventListener("message", (event: MessageEvent<NuiMessageData>) => {
    const data = event.data;
    switch (data.event) {
        case "visible":
            body.style.visibility = data.state ? "visible" : "hidden";
            if (settings.current.showCenterCursor) {
                centerCursor.style.display = data.state ? "flex" : "none";
            } else {
                centerCursor.style.display = "none";
            }
            if (!data.state) {
                closeAllMenus();
            }
            return;

        case "openSettings":
            body.style.visibility = "visible";
            body.classList.add("in-settings");
            settingsContainer.style.display = "flex";

            const previewAnchor = document.getElementById("preview-anchor");
            if (previewAnchor && menuCard) {
                previewAnchor.appendChild(menuCard);
            }

            syncUIControls();

            if (optionsWrapper.innerHTML === "") {
                const mockOptions = [
                    { type: "global", data: { icon: "fa-solid fa-eye", label: "Visual Preview", hide: false }, id: 1 },
                    { type: "entity", data: { icon: "fa-solid fa-palette", label: "Live Color Test", hide: false }, id: 2 },
                    { type: "zone", data: { icon: "fa-solid fa-font", label: "Typography Test", hide: false }, id: 3 }
                ];
                renderMenu(mockOptions);
            }
            return;

        case "setTarget": {
            const optionsList: any[] = [];
            if (data.options) {
                for (const [type, typeOptions] of Object.entries(data.options)) {
                    (typeOptions as any[]).forEach((d, id) => {
                        if (!d.hide) optionsList.push({ type, data: d, id: id + 1 });
                    });
                }
            }
            if (data.zones) {
                data.zones.forEach((zoneOpts, zoneId) => {
                    (zoneOpts as any[]).forEach((d, id) => {
                        if (!d.hide) optionsList.push({ type: "zones", data: d, id: id + 1, zoneId: zoneId + 1 });
                    });
                });
            }

            if (currentMenuOptions.length > 0) {
                menuHistory.push([...currentMenuOptions]);
            }

            renderMenu(optionsList);
            return;
        }

        case "leftTarget":
            closeAllMenus();
            return;

        case "setWorldTarget":
            closeAllMenus();
            const worldOptions = (data.options || []).map((opt: any) => ({ type: opt.type, data: opt, id: opt.id }));
            renderMenu(worldOptions);
            return;

        case "worldPosition":
            if (data.x === undefined || data.y === undefined) return;
            const px = data.x * window.innerWidth;
            const py = data.y * window.innerHeight;
            menuCard.style.left = (px + 6) + "px";
            menuCard.style.top = (py - 16) + "px";
            return;
    }
});

function renderMenu(options: any[]) {
    optionsWrapper.innerHTML = "";
    currentMenuOptions = options;

    options.forEach((opt) => {
        createOptions(opt.type, opt.data, opt.id, opt.zoneId || null);
    });

    if (options.length > 0) {
        menuCard.style.display = "flex";
        cardHeader.style.display = menuHistory.length > 0 ? "block" : "none";

        const scrollIndicator = document.getElementById("scroll-indicator");
        if (scrollIndicator) {
            scrollIndicator.style.display = optionsWrapper.scrollHeight > optionsWrapper.clientHeight ? "block" : "none";
        }
    } else {
        menuCard.style.display = "none";
    }
}

function closeAllMenus() {
    menuCard.style.display = "none";
    optionsWrapper.innerHTML = "";
    settingsContainer.style.display = "none";
    body.classList.remove("in-settings");
    menuHistory = [];
    currentMenuOptions = [];

    const app = document.getElementById("app");
    if (app && menuCard && menuCard.parentElement !== app) {
        app.appendChild(menuCard);
    }
}

backButton?.addEventListener("click", () => {
    if (menuHistory.length > 0) {
        const previous = menuHistory.pop();
        if (previous) renderMenu(previous);
    }
});

document.getElementById("close-settings")?.addEventListener("click", () => {
    closeAllMenus();
    fetchNui("closeSettings").catch(() => { });
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (settingsContainer.style.display === "flex") {
            closeAllMenus();
            fetchNui("closeSettings").catch(() => { });
        }
    }
});

document.getElementById("reset-settings")?.addEventListener("click", () => {
    settings.reset(() => {
        syncUIControls();
    });
});

document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
        document.querySelectorAll(".settings-content").forEach(c => (c as HTMLElement).style.display = "none");

        item.classList.add("active");
        const tabId = item.getAttribute("data-tab-link");
        const content = document.getElementById(`tab-${tabId}`);
        if (content) content.style.display = "flex";
    });
});

document.querySelectorAll(".color-picker-input").forEach(input => {
    const settingKey = input.getAttribute("data-setting") as any;
    input.addEventListener("input", (e) => {
        const val = (e.target as HTMLInputElement).value;
        settings.update({ [settingKey]: val });
    });
});

document.querySelectorAll(".segmented-control").forEach(control => {
    const settingKey = control.getAttribute("data-setting") as any;
    control.querySelectorAll(".segment").forEach(segment => {
        segment.addEventListener("click", () => {
            control.querySelectorAll(".segment").forEach(s => s.classList.remove("active"));
            segment.classList.add("active");
            const val = segment.getAttribute("data-val");
            settings.update({ [settingKey]: val });
        });
    });
});

document.querySelectorAll("input[type=range]").forEach(input => {
    const settingKey = input.getAttribute("data-setting") as any;
    input.addEventListener("input", (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        settings.update({ [settingKey]: val });
    });
});

document.querySelectorAll(".toggle-switch").forEach(toggle => {
    const settingKey = toggle.getAttribute("data-setting") as any;
    toggle.addEventListener("click", () => {
        const isActive = toggle.classList.toggle("active");
        settings.update({ [settingKey]: isActive });
    });
});

if (!(window as any).invokeNative) {
    body.style.visibility = "visible";
    body.classList.add("debug-bg");

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === 's') {
            const isOpen = settingsContainer.style.display === "flex";
            settingsContainer.style.display = isOpen ? "none" : "flex";
            if (!isOpen) body.classList.add("in-settings");
            else body.classList.remove("in-settings");
        }
    });

    setTimeout(() => {
        window.postMessage({
            event: "setWorldTarget",
            options: [
                { icon: "fa-solid fa-folder", label: "Example Menu >", type: "global", id: 1 },
                { icon: "fa-solid fa-car", label: "Option 2", type: "entity", id: 2 }
            ]
        }, "*");

        body.classList.add("in-settings");
        settingsContainer.style.display = "flex";

        window.postMessage({
            event: "worldPosition",
            x: 0.6,
            y: 0.4
        }, "*");
    }, 200);
}

function syncUIControls() {
    const current = settings.current;

    document.querySelectorAll("input[type=range]").forEach(input => {
        const key = input.getAttribute("data-setting") as keyof UISettings;
        if (key && current[key] !== undefined) {
            (input as HTMLInputElement).value = String(current[key]);
        }
    });

    document.querySelectorAll(".segmented-control").forEach(control => {
        const key = control.getAttribute("data-setting") as keyof UISettings;
        if (key && current[key] !== undefined) {
            control.querySelectorAll(".segment").forEach(segment => {
                if (segment.getAttribute("data-val") === String(current[key])) {
                    segment.classList.add("active");
                } else {
                    segment.classList.remove("active");
                }
            });
        }
    });

    document.querySelectorAll(".toggle-switch").forEach(toggle => {
        const key = toggle.getAttribute("data-setting") as keyof UISettings;
        if (key && current[key] !== undefined) {
            if (current[key]) {
                toggle.classList.add("active");
            } else {
                toggle.classList.remove("active");
            }
        }
    });

    const accentInput = document.getElementById("accent-color-picker") as HTMLInputElement;
    if (accentInput) accentInput.value = current.accentColor || '#a19ffb';

    const fontInput = document.getElementById("font-color-picker") as HTMLInputElement;
    if (fontInput) fontInput.value = current.fontColor || '#ffffff';
}
