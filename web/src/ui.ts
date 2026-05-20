export class UIBuilder {
  static buildApp() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
      <div id="center-cursor">
        <div class="dot"></div>
      </div>

      <div id="settings-container" class="custom-theme">
        
        <div class="settings-header">
            <h1>TARGET</h1>
            <p>Settings & Customization</p>
        </div>

        <div class="settings-main-layout">
            
            <div class="settings-sidebar">
                <div class="sidebar-item active" data-tab-link="general">
                    General
                </div>
                <div class="sidebar-item" data-tab-link="customization">
                    Customization
                </div>
            </div>

            <div class="settings-content-area">
                
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

      <div id="menu-card">
        <div id="card-header" style="display:none">
            <div id="back-button"><i class="fas fa-chevron-left"></i> BACK</div>
        </div>
        <div id="card-connector"></div>
        <div id="options-wrapper"></div>
        <div id="scroll-indicator" style="display:none">
            <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    `;
  }
}
