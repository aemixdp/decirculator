// @flow

import utils from './';

type ThemeManagerOptions = {
    pollInterval: number;
    onThemeChanged: () => void;
};

export default class {
    theme: Object;
    pollInterval: number;
    onThemeChanged: () => void;
    constructor(options: ThemeManagerOptions) {
        this.theme = Object.create(null);
        this.invalidateTheme();
        this.onThemeChanged = options.onThemeChanged;
        setInterval(this.invalidateTheme, options.pollInterval);
    }
    invalidateTheme = () => {
        const bodyComputedStyle = window.getComputedStyle(document.body);
        const sheet = (document.styleSheets[0]: any);
        const rootStyle = (sheet.rules || sheet.cssRules)[0].style;
        let themeChanged = false;
        for (let i = 0; i < rootStyle.length; ++i) {
            const propertyName = rootStyle[i];
            const propertyValue = bodyComputedStyle.getPropertyValue(propertyName);
            const camelPropertyName = utils.text.snakeToCamel(propertyName.slice(2));
            if (this.theme[camelPropertyName] !== propertyValue) {
                this.theme[camelPropertyName] = propertyValue;
                themeChanged = true;
            }
        }
        if (themeChanged) {
            this.onThemeChanged();
        }
    }
}