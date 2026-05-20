export interface TargetOption {
    label: string;
    icon: string;
    type?: string;
    id?: number;
    hide?: boolean;
    iconColor?: string;
    menu?: any[];
}

export interface UISettings {
    theme: 'cheat' | 'glass' | 'minimal';
    scale: 'XS' | 'S' | 'M' | 'L' | 'XL';
    lineStyle: 'straight' | 'l-shape' | 'none';
    transparency: number;
    showCenterCursor: boolean;
    accentColor: string;
    glowIntensity: number;
    animationSpeed: number;
    enableSounds: boolean;
    borderRadius: number;
    borderWidth: number;
    layoutStyle: 'classic' | 'minimal' | 'compact';
    fontColor: string;
    fontWeight: '300' | '400' | '600' | '700';
    fontSize: number;
    cardBgMode?: 'solid' | 'transparent' | 'gradient';
    hoverStyle?: 'slide' | 'glow' | 'scale';
    iconSize?: number;
    letterSpacing?: number;
    textTransform?: 'uppercase' | 'capitalize' | 'none';
}

export interface NuiMessageData {
    event: string;
    state?: boolean;
    options?: any;
    zones?: any[];
    x?: number;
    y?: number;
}
