import { eventChannel } from 'redux-saga';
import { put, take, fork, select } from 'redux-saga/effects';
import { GlobalState } from '../reducers/globalReducer';
import * as globalActions from '../actions/GlobalAction';
import { MidiManager } from '../utils/MidiManager';
import { GlobalAction, SEND_MIDI, REFRESH_MIDI_DEVICES } from '../actions/GlobalAction';

function* dispatchMidiOutputsInvalidation(midiManager: MidiManager) {
    const chan = eventChannel(emitter => {
        midiManager.onOutputsChange = () =>
            emitter(globalActions.invalidateMidiOutputs(Object.keys(midiManager.midiOutputs)));
        return () => { };
    });
    while (true) {
        yield put(yield take(chan));
    }
}

export function* midiSaga() {
    const midiManager = new MidiManager();
    yield fork(dispatchMidiOutputsInvalidation, midiManager);
    while (true) {
        const action: GlobalAction = yield take();
        const state: GlobalState = (yield select()).present;
        switch (action.type) {
            case SEND_MIDI:
                const midiOutputName = state.config.midiOutputName;
                if (midiOutputName) {
                    midiManager.note(midiOutputName, action.noteOn, action.channel, action.note, action.velocity);
                }
                break;
            case REFRESH_MIDI_DEVICES:
                midiManager.refreshDevices();
                break;
            default:
                break;
        }
    }
}