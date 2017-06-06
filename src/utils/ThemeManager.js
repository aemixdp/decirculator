import textUtils from './text';

export default class {
    constructor({ pollInterval = 500, onThemeChanged = () => { } }) {
        this.eventHandlers = Object.create(null);
        this.theme = Object.create(null);
        this.invalidateTheme();
        this.onThemeChanged = onThemeChanged;
        setInterval(this.invalidateTheme, pollInterval);
    }
    invalidateTheme = () => {
        const bodyComputedStyle = window.getComputedStyle(document.body);
        const sheet = document.styleSheets[0];
        const rootStyle = (sheet.rules || sheet.cssRules)[0].style;
        let themeChanged = false;
        for (let i = 0; i < rootStyle.length; ++i) {
            const propertyName = rootStyle[i];
            const propertyValue = bodyComputedStyle.getPropertyValue(propertyName);
            const camelPropertyName = textUtils.snakeToCamel(propertyName.slice(2));
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