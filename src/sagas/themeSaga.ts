import * as globalActions from '../actions/GlobalAction';
import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { ThemeManager } from '../utils/ThemeManager';

export function* themeSaga() {
    const themeManager = new ThemeManager({
        pollInterval: 500,
    });
    const chan = eventChannel(emitter => {
        themeManager.onThemeChanged = () =>
            emitter(globalActions.invalidateTheme(themeManager.theme));
        return () => { };
    });
    yield put(globalActions.invalidateTheme(themeManager.theme));
    while (true) {
        yield put(yield take(chan));
    }
}