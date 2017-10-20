import { eventChannel, Task } from 'redux-saga';
import { put, take, fork, cancel, select } from 'redux-saga/effects';
import * as globalActions from '../actions/GlobalAction';
import * as circuitObjectsActions from '../actions/CircuitObjectsAction';
import { SimulationAction, START_SIMULATION, PAUSE_SIMULATION, STOP_SIMULATION } from '../actions/SimulationAction';
import { StateWithHistory } from 'redux-undo';
import { GlobalState } from '../reducers/globalReducer';
import { Circuit } from '../circuitry/Circuit';
import { WireCircuitObject } from '../data/CircuitObject/WireCircuitObject';
import { BlockCircuitObject } from '../data/CircuitObject/BlockCircuitObject';
import { CircuitConfig } from '../circuitry/data/CircuitConfig';

function* dispatchCircuitEvents(circuit: Circuit) {
    const chan = eventChannel(emitter => {
        circuit.onMidiOut = (ccMode, noteOn, note, channel, velocity) =>
            emitter(globalActions.sendMidi(ccMode, noteOn, note, channel, velocity));
        circuit.onVisibleChanges = () =>
            emitter(circuitObjectsActions.invalidateCircuitry(circuit));
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
    let wires: WireCircuitObject[] | undefined;
    let blocks: BlockCircuitObject[] | undefined;
    let config: CircuitConfig | undefined;
    while (true) {
        const action: SimulationAction = yield take();
        const state: StateWithHistory<GlobalState> = yield select();
        const newWires = state.present.circuitObjects.wires;
        const newBlocks = state.present.circuitObjects.blocks;
        const newConfig = state.present.config;
        if (circuit && (wires !== newWires || blocks !== newBlocks || config !== newConfig)) {
            circuit.update(newBlocks, newWires, newConfig);
        }
        wires = newWires;
        blocks = newBlocks;
        config = newConfig;
        switch (action.type) {
            case START_SIMULATION:
                if (!circuit) {
                    circuit = new Circuit();
                    circuitEventsDispatcher = yield fork(dispatchCircuitEvents, circuit);
                    circuit.update(blocks, wires, config);
                }
                circuit.start();
                break;
            case PAUSE_SIMULATION:
                if (circuit) {
                    circuit.stop();
                }
                break;
            case STOP_SIMULATION:
                if (circuit) {
                    circuit.stop();
                    circuit = undefined;
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
