import ThemeManager from './ThemeManager';
import textUtils from './text';
import geometryUtils from './geometry';

export default {
    ThemeManager,
    ...textUtils,
    ...geometryUtils,
    events: {
        propagationStopper: (e) => e.stopPropagation(),
    },
}