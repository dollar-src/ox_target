var T=Object.defineProperty;var k=(e,t,i)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var L=(e,t,i)=>k(e,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();async function u(e,t,i){const n={method:"POST",headers:{"Content-Type":"application/json; charset=UTF-8"},body:JSON.stringify(t)},s=window.GetParentResourceName?window.GetParentResourceName():"ox_target";try{return await(await fetch(`https://${s}/${e}`,n)).json()}catch(a){throw a}}function P(){this.style.pointerEvents="none",u("select",[this.targetType,this.targetId,this.zoneId]),setTimeout(()=>this.style.pointerEvents="auto",100)}function B(e,t,i,n){const s=document.getElementById("options-wrapper");if(!s||t.hide)return;const a=document.createElement("div"),o=`<i class="fa-fw ${t.icon} option-icon" ${t.iconColor?`style="color:${t.iconColor} !important"`:""}"></i>`;a.innerHTML=`${o}<p class="option-label">${t.label}</p>`,a.className="option-container",a.targetType=e,a.targetId=i,a.zoneId=n,a.addEventListener("click",P),s.appendChild(a)}const S={theme:"cheat",scale:"M",lineStyle:"l-shape",transparency:.65,showCenterCursor:!0,accentColor:"#a19ffb",glowIntensity:1,animationSpeed:.25,enableSounds:!0,borderRadius:4,borderWidth:1,layoutStyle:"classic",fontColor:"#ffffff",fontWeight:"400",fontSize:13,cardBgMode:"solid",hoverStyle:"slide",iconSize:14,letterSpacing:0,textTransform:"uppercase"};class M{constructor(){L(this,"settings");let t=null;try{const i=localStorage.getItem("ox_target_settings");i&&(t=JSON.parse(i))}catch{}this.settings=t?{...S,...t}:{...S},this.applySettings()}get current(){return this.settings}update(t){this.settings={...this.settings,...t},localStorage.setItem("ox_target_settings",JSON.stringify(this.settings)),this.applySettings(),u("updateSettings",this.settings).catch(()=>{})}reset(t){this.settings={...S},localStorage.removeItem("ox_target_settings"),this.applySettings(),u("updateSettings",this.settings).catch(()=>{}),t&&t()}applySettings(){const t=document.documentElement,i=this.settings.accentColor||"#a19ffb";t.style.setProperty("--color-accent",i);const n=i.replace("#",""),s=parseInt(n.substring(0,2),16),a=parseInt(n.substring(2,4),16),o=parseInt(n.substring(4,6),16),g=document.getElementById("accent-color-picker");g&&(g.value=i);const p=document.getElementById("font-color-picker");p&&(p.value=this.settings.fontColor),t.style.setProperty("--color-accent-dim",`rgba(${s}, ${a}, ${o}, 0.35)`),t.style.setProperty("--color-accent-glow",`rgba(${s}, ${a}, ${o}, ${.18*this.settings.glowIntensity})`);let c=this.settings.transparency;this.settings.theme==="glass"&&(c=.4),t.style.setProperty("--color-bg-card",`rgba(10, 10, 18, ${c})`),t.style.setProperty("--color-text",this.settings.fontColor),t.style.setProperty("--font-weight",this.settings.fontWeight),t.style.setProperty("--font-size",`${this.settings.fontSize}px`),t.style.setProperty("--border-radius",`${this.settings.borderRadius}px`),t.style.setProperty("--border-width",`${this.settings.borderWidth}px`),t.style.setProperty("--anim-speed",`${this.settings.animationSpeed}s`),t.style.setProperty("--glow-blur",`${15*this.settings.glowIntensity}px`);const y={XS:"0.75",S:"0.85",M:"1.0",L:"1.15",XL:"1.3"};t.style.setProperty("--ui-scale",y[this.settings.scale||"M"]||"1.0"),t.style.setProperty("--icon-size",`${this.settings.iconSize||14}px`),t.style.setProperty("--letter-spacing",`${this.settings.letterSpacing||0}px`),document.body.setAttribute("data-layout",this.settings.layoutStyle||"classic"),document.body.setAttribute("data-theme",this.settings.theme||"cheat"),document.body.setAttribute("data-card-bg",this.settings.cardBgMode||"solid"),document.body.setAttribute("data-hover-style",this.settings.hoverStyle||"slide"),document.body.setAttribute("data-text-transform",this.settings.textTransform||"uppercase")}}class z{static buildApp(){const t=document.getElementById("app");t&&(t.innerHTML=`
      <!-- Interaction Cursor -->
      <div id="center-cursor">
        <div class="dot"></div>
      </div>

      <!-- Fullscreen Settings Menu -->
      <div id="settings-container" class="custom-theme">
        
        <!-- Header -->
        <div class="settings-header">
            <h1>TARGET</h1>
            <p>Settings & Customization</p>
        </div>

        <!-- Main Layout -->
        <div class="settings-main-layout">
            
            <!-- Left Sidebar -->
            <div class="settings-sidebar">
                <div class="sidebar-item active" data-tab-link="general">
                    General
                </div>
                <div class="sidebar-item" data-tab-link="customization">
                    Customization
                </div>
            </div>

            <!-- Center Content -->
            <div class="settings-content-area">
                
                <!-- General Tab -->
                <div class="settings-content active" id="tab-general">
                    <div class="setting-row">
                        <span class="setting-label">UI Scale</span>
                        <div class="segmented-control" data-setting="scale">
                            <div class="segment" data-val="XS">XS</div>
                            <div class="segment" data-val="S">S</div>
                            <div class="segment active" data-val="M">M</div>
                            <div class="segment" data-val="L">L</div>
                            <div class="segment" data-val="XL">XL</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Background Transparency</span>
                        <input type="range" min="0.2" max="1.0" step="0.05" value="0.65" data-setting="transparency">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Center Cursor Dot</span>
                        <div class="toggle-switch active" data-setting="showCenterCursor">
                            <div class="switch-handle"></div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Accent Color (Infinite)</span>
                        <input type="color" id="accent-color-picker" class="color-picker-input" data-setting="accentColor" value="#a19ffb">
                    </div>
                </div>

                <!-- Customization Tab -->
                <div class="settings-content" id="tab-customization" style="display:none;">
                    <div class="setting-row">
                        <span class="setting-label">Interaction Line Style</span>
                        <div class="segmented-control" data-setting="lineStyle">
                            <div class="segment active" data-val="l-shape">L-Shape</div>
                            <div class="segment" data-val="straight">Straight</div>
                            <div class="segment" data-val="none">None</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Layout Style</span>
                        <div class="segmented-control" data-setting="layoutStyle">
                            <div class="segment active" data-val="classic">Classic</div>
                            <div class="segment" data-val="sleek">Sleek</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Font Weight</span>
                        <div class="segmented-control" data-setting="fontWeight">
                            <div class="segment" data-val="300">Light</div>
                            <div class="segment active" data-val="400">Regular</div>
                            <div class="segment" data-val="700">Bold</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Corner Rounding</span>
                        <input type="range" min="0" max="25" step="1" value="4" data-setting="borderRadius">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Border Width</span>
                        <input type="range" min="0" max="5" step="1" value="1" data-setting="borderWidth">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Glow Intensity</span>
                        <input type="range" min="0.0" max="2.0" step="0.1" value="1.0" data-setting="glowIntensity">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Animation Speed</span>
                        <input type="range" min="0.1" max="1.0" step="0.05" value="0.25" data-setting="animationSpeed">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Card Background Mode</span>
                        <div class="segmented-control" data-setting="cardBgMode">
                            <div class="segment active" data-val="solid">Solid</div>
                            <div class="segment" data-val="transparent">Transparent</div>
                            <div class="segment" data-val="gradient">Gradient</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Row Hover Style</span>
                        <div class="segmented-control" data-setting="hoverStyle">
                            <div class="segment active" data-val="slide">Slide</div>
                            <div class="segment" data-val="glow">Glow</div>
                            <div class="segment" data-val="scale">Scale</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Text Case</span>
                        <div class="segmented-control" data-setting="textTransform">
                            <div class="segment active" data-val="uppercase">UPPER</div>
                            <div class="segment" data-val="capitalize">Title</div>
                            <div class="segment" data-val="none">Normal</div>
                        </div>
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Icon Size</span>
                        <input type="range" min="10" max="24" step="1" value="14" data-setting="iconSize">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Letter Spacing</span>
                        <input type="range" min="0" max="4" step="0.5" value="0" data-setting="letterSpacing">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Font Size</span>
                        <input type="range" min="10" max="20" step="1" value="13" data-setting="fontSize">
                    </div>

                    <div class="setting-row">
                        <span class="setting-label">Font Color</span>
                        <input type="color" id="font-color-picker" class="color-picker-input" data-setting="fontColor" value="#ffffff">
                    </div>
                </div>

            </div>

            <!-- Right Area (Preview Placeholder) -->
            <div class="settings-preview-area">
                <div class="preview-title">Live Preview</div>
                <div class="preview-anchor" id="preview-anchor"></div>
            </div>
        </div>

        <div class="settings-footer">
            <button id="reset-settings" class="btn-reset">Reset to Default</button>
            <button id="close-settings" class="btn-close">Close Settings</button>
        </div>
      </div>

      <!-- Main Interaction Card (With sub-menu support) -->
      <div id="menu-card">
        <div id="card-header" style="display:none">
            <div id="back-button"><i class="fas fa-chevron-left"></i> BACK</div>
        </div>
        <div id="card-connector"></div>
        <div id="options-wrapper"></div>
        <!-- Scroll indicator if > 5 items -->
        <div id="scroll-indicator" style="display:none">
            <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    `)}}z.buildApp();const d=new M;u("updateSettings",d.current).catch(()=>{});const f=document.getElementById("options-wrapper"),l=document.getElementById("menu-card"),I=document.getElementById("center-cursor"),v=document.getElementById("settings-container"),$=document.getElementById("card-header"),E=document.getElementById("back-button"),r=document.body;let h=[],w=[];window.addEventListener("message",e=>{const t=e.data;switch(t.event){case"visible":r.style.visibility=t.state?"visible":"hidden",d.current.showCenterCursor?I.style.display=t.state?"flex":"none":I.style.display="none",t.state||m();return;case"openSettings":r.style.visibility="visible",r.classList.add("in-settings"),v.style.display="flex";const i=document.getElementById("preview-anchor");i&&l&&i.appendChild(l),A(),f.innerHTML===""&&b([{type:"global",data:{icon:"fa-solid fa-eye",label:"Visual Preview",hide:!1},id:1},{type:"entity",data:{icon:"fa-solid fa-palette",label:"Live Color Test",hide:!1},id:2},{type:"zone",data:{icon:"fa-solid fa-font",label:"Typography Test",hide:!1},id:3}]);return;case"setTarget":{const o=[];if(t.options)for(const[g,p]of Object.entries(t.options))p.forEach((c,y)=>{c.hide||o.push({type:g,data:c,id:y+1})});t.zones&&t.zones.forEach((g,p)=>{g.forEach((c,y)=>{c.hide||o.push({type:"zones",data:c,id:y+1,zoneId:p+1})})}),w.length>0&&h.push([...w]),b(o);return}case"leftTarget":m();return;case"setWorldTarget":m();const n=(t.options||[]).map(o=>({type:o.type,data:o,id:o.id}));b(n);return;case"worldPosition":if(t.x===void 0||t.y===void 0)return;const s=t.x*window.innerWidth,a=t.y*window.innerHeight;l.style.left=s+6+"px",l.style.top=a-16+"px";return}});function b(e){if(f.innerHTML="",w=e,e.forEach(t=>{B(t.type,t.data,t.id,t.zoneId||null)}),e.length>0){l.style.display="flex",$.style.display=h.length>0?"block":"none";const t=document.getElementById("scroll-indicator");t&&(t.style.display=f.scrollHeight>f.clientHeight?"block":"none")}else l.style.display="none"}function m(){l.style.display="none",f.innerHTML="",v.style.display="none",r.classList.remove("in-settings"),h=[],w=[];const e=document.getElementById("app");e&&l&&l.parentElement!==e&&e.appendChild(l)}E==null||E.addEventListener("click",()=>{if(h.length>0){const e=h.pop();e&&b(e)}});var C;(C=document.getElementById("close-settings"))==null||C.addEventListener("click",()=>{m(),u("closeSettings").catch(()=>{})});window.addEventListener("keydown",e=>{e.key==="Escape"&&v.style.display==="flex"&&(m(),u("closeSettings").catch(()=>{}))});var x;(x=document.getElementById("reset-settings"))==null||x.addEventListener("click",()=>{d.reset(()=>{A()})});document.querySelectorAll(".sidebar-item").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".sidebar-item").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".settings-content").forEach(n=>n.style.display="none"),e.classList.add("active");const t=e.getAttribute("data-tab-link"),i=document.getElementById(`tab-${t}`);i&&(i.style.display="flex")})});document.querySelectorAll(".color-picker-input").forEach(e=>{const t=e.getAttribute("data-setting");e.addEventListener("input",i=>{const n=i.target.value;d.update({[t]:n})})});document.querySelectorAll(".segmented-control").forEach(e=>{const t=e.getAttribute("data-setting");e.querySelectorAll(".segment").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll(".segment").forEach(s=>s.classList.remove("active")),i.classList.add("active");const n=i.getAttribute("data-val");d.update({[t]:n})})})});document.querySelectorAll("input[type=range]").forEach(e=>{const t=e.getAttribute("data-setting");e.addEventListener("input",i=>{const n=parseFloat(i.target.value);d.update({[t]:n})})});document.querySelectorAll(".toggle-switch").forEach(e=>{const t=e.getAttribute("data-setting");e.addEventListener("click",()=>{const i=e.classList.toggle("active");d.update({[t]:i})})});window.invokeNative||(r.style.visibility="visible",r.classList.add("debug-bg"),window.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="s"){const t=v.style.display==="flex";v.style.display=t?"none":"flex",t?r.classList.remove("in-settings"):r.classList.add("in-settings")}}),setTimeout(()=>{window.postMessage({event:"setWorldTarget",options:[{icon:"fa-solid fa-folder",label:"Example Menu >",type:"global",id:1},{icon:"fa-solid fa-car",label:"Option 2",type:"entity",id:2}]},"*"),r.classList.add("in-settings"),v.style.display="flex",window.postMessage({event:"worldPosition",x:.6,y:.4},"*")},200));function A(){const e=d.current;document.querySelectorAll("input[type=range]").forEach(n=>{const s=n.getAttribute("data-setting");s&&e[s]!==void 0&&(n.value=String(e[s]))}),document.querySelectorAll(".segmented-control").forEach(n=>{const s=n.getAttribute("data-setting");s&&e[s]!==void 0&&n.querySelectorAll(".segment").forEach(a=>{a.getAttribute("data-val")===String(e[s])?a.classList.add("active"):a.classList.remove("active")})}),document.querySelectorAll(".toggle-switch").forEach(n=>{const s=n.getAttribute("data-setting");s&&e[s]!==void 0&&(e[s]?n.classList.add("active"):n.classList.remove("active"))});const t=document.getElementById("accent-color-picker");t&&(t.value=e.accentColor||"#a19ffb");const i=document.getElementById("font-color-picker");i&&(i.value=e.fontColor||"#ffffff")}
