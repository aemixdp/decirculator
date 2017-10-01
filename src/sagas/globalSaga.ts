import { put, take, select } from 'redux-saga/effects';
import { CircuitObjectsAction, PASTE_OBJECTS } from '../actions/CircuitObjectsAction';
import * as uiActions from '../actions/UiAction';
import * as simulationActions from '../actions/SimulationAction';
import { GlobalState } from '../reducers/globalReducer';
import { GlobalAction, LOAD } from '../actions/GlobalAction';

export function* globalSaga() {
    while (true) {
        const action: CircuitObjectsAction | GlobalAction = yield take();
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
            case LOAD:
                if (state.simulationState !== 'STOPPED') {
                    yield put(simulationActions.stop);
                }
                break;
            default:
                break;
        }
    }
}