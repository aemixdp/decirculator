import { snakeToCamel } from './textUtils';

type ThemeManagerOptions = {
    pollInterval: number;
    onThemeChanged?: () => void;
};

export class ThemeManager {
    theme: any;
    pollInterval: number;
    onThemeChanged?: () => void;
    constructor(options: ThemeManagerOptions) {
        this.theme = Object.create(null);
        this.onThemeChanged = options.onThemeChanged;
        this.invalidateTheme();
        setInterval(this.invalidateTheme, options.pollInterval);
    }
    invalidateTheme = () => {
        const bodyComputedStyle = window.getComputedStyle(document.body);
        const sheet = document.styleSheets[0] as any;
        const rootStyle = (sheet.rules || sheet.cssRules)[0].style;
        let themeChanged = false;
        for (let i = 0; i < rootStyle.length; ++i) {
            const propertyName = rootStyle[i];
            const propertyValue = bodyComputedStyle.getPropertyValue(propertyName);
            const camelPropertyName = snakeToCamel(propertyName.slice(2));
            if (this.theme[camelPropertyName] !== propertyValue) {
                this.theme[camelPropertyName] = propertyValue;
                themeChanged = true;
            }
        }
        if (themeChanged && this.onThemeChanged) {
            this.onThemeChanged();
        }
    }
}
