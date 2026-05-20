import { UISettings } from "./types";
import { fetchNui } from "./fetchNui";


const DEFAULT_SETTINGS: UISettings = {
    theme: 'cheat',
    scale: 'M',
    lineStyle: 'l-shape',
    transparency: 0.65,
    showCenterCursor: true,
    accentColor: '#a19ffb',
    glowIntensity: 1.0,
    animationSpeed: 0.25,
    enableSounds: true,
    borderRadius: 4,
    borderWidth: 1,
    layoutStyle: 'classic',
    fontColor: '#ffffff',
    fontWeight: '400',
    fontSize: 13,
    cardBgMode: 'solid',
    hoverStyle: 'slide',
    iconSize: 14,
    letterSpacing: 0,
    textTransform: 'uppercase'
};

export class SettingsManager {
    private settings: UISettings;

    constructor() {
        let savedSettings = null;
        try {
            const saved = localStorage.getItem('ox_target_settings');
            if (saved) savedSettings = JSON.parse(saved);
        } catch {}
        this.settings = savedSettings ? { ...DEFAULT_SETTINGS, ...savedSettings } : { ...DEFAULT_SETTINGS };
        this.applySettings();
    }

    get current() { return this.settings; }

    update(newSettings: Partial<UISettings>) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('ox_target_settings', JSON.stringify(this.settings));
        this.applySettings();
        fetchNui('updateSettings', this.settings).catch(() => {});
    }

    reset(onReset?: () => void) {
        this.settings = { ...DEFAULT_SETTINGS };
        localStorage.removeItem('ox_target_settings');
        this.applySettings();
        fetchNui('updateSettings', this.settings).catch(() => {});
        if (onReset) onReset();
    }

    private applySettings() {
        const root = document.documentElement;

        const accentColor = this.settings.accentColor || '#a19ffb';
        root.style.setProperty('--color-accent', accentColor);

        const hex = accentColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const accentInput = document.getElementById("accent-color-picker") as HTMLInputElement;
        if (accentInput) accentInput.value = accentColor;

        const fontInput = document.getElementById("font-color-picker") as HTMLInputElement;
        if (fontInput) fontInput.value = this.settings.fontColor;

        root.style.setProperty('--color-accent-dim', `rgba(${r}, ${g}, ${b}, 0.35)`);
        root.style.setProperty('--color-accent-glow', `rgba(${r}, ${g}, ${b}, ${0.18 * this.settings.glowIntensity})`);

        let bgTransparency = this.settings.transparency;
        if (this.settings.theme === 'glass') bgTransparency = 0.4;

        root.style.setProperty('--color-bg-card', `rgba(10, 10, 18, ${bgTransparency})`);

        root.style.setProperty('--color-text', this.settings.fontColor);
        root.style.setProperty('--font-weight', this.settings.fontWeight);
        root.style.setProperty('--font-size', `${this.settings.fontSize}px`);

        root.style.setProperty('--border-radius', `${this.settings.borderRadius}px`);
        root.style.setProperty('--border-width', `${this.settings.borderWidth}px`);
        root.style.setProperty('--anim-speed', `${this.settings.animationSpeed}s`);
        root.style.setProperty('--glow-blur', `${15 * this.settings.glowIntensity}px`);

        const scales = { 'XS': '0.75', 'S': '0.85', 'M': '1.0', 'L': '1.15', 'XL': '1.3' };
        root.style.setProperty('--ui-scale', scales[this.settings.scale || 'M'] || '1.0');

        root.style.setProperty('--icon-size', `${this.settings.iconSize || 14}px`);
        root.style.setProperty('--letter-spacing', `${this.settings.letterSpacing || 0}px`);

        document.body.setAttribute('data-layout', this.settings.layoutStyle || 'classic');
        document.body.setAttribute('data-theme', this.settings.theme || 'cheat');
        document.body.setAttribute('data-card-bg', this.settings.cardBgMode || 'solid');
        document.body.setAttribute('data-hover-style', this.settings.hoverStyle || 'slide');
        document.body.setAttribute('data-text-transform', this.settings.textTransform || 'uppercase');
    }
}
