import { eventChannel, Task } from 'redux-saga';
import { put, take, fork, cancel } from 'redux-saga/effects';
import * as simulationActions from '../actions/SimulationAction';
import * as globalActions from '../actions/GlobalAction';
import { Circuit } from '../circuitry/Circuit';

function* dispatchCircuitEvents(circuit: Circuit) {
    const chan = eventChannel(emitter => {
        circuit.onMidiOut = (noteOn, note, channel, velocity) =>
            emitter(globalActions.sendMidi(noteOn, note, channel, velocity));
        circuit.onVisibleChanges = () =>
            emitter(globalActions.invalidateCircuit(circuit));
        return () => {
            circuit.stop();
        };
    });
    while (true) {
        yield put(yield take(chan));
    }
}

export function* circuitSaga() {
    let circuit: Circuit | undefined;
    let circuitEventsDispatcher: Task | undefined;
    while (true) {
        const action = yield take();
        switch (action.type) {
            case simulationActions.start.type:
                if (!circuit) {
                    circuit = new Circuit();
                    circuitEventsDispatcher = yield fork(dispatchCircuitEvents, circuit);
                }
                circuit.start();
                break;
            case simulationActions.pause.type:
                if (circuit) {
                    circuit.stop();
                }
                break;
            case simulationActions.stop.type:
                if (circuit) {
                    circuit.stop();
                }
                if (circuitEventsDispatcher) {
                    yield cancel(circuitEventsDispatcher);
                }
                break;
            default:
                break;
        }
    }
}