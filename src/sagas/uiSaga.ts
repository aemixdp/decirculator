import { put, take, select } from 'redux-saga/effects';
import { CircuitObjectsAction, PASTE_OBJECTS } from '../actions/CircuitObjectsAction';
import * as uiActions from '../actions/UiAction';
import { GlobalState } from '../reducers/globalReducer';

export function* uiSaga() {
    while (true) {
        const action: CircuitObjectsAction = yield take();
        const state: GlobalState = (yield select()).present;
        switch (action.type) {
            case PASTE_OBJECTS:
                const copyBufferSize = state.circuitObjects.copyBufferBlockIds.size;
                yield put(uiActions.selectObjects(
                    new Set(
                        state.circuitObjects.blocks
                            .slice(-copyBufferSize)
                            .map(block => block.id)
                    )
                ));
                break;
            default:
                break;
        }
    }
}