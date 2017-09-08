import { eventChannel } from 'redux-saga';
import { put, take, fork, select } from 'redux-saga/effects';
import { StateWithHistory } from 'redux-undo';
import { GlobalState } from '../reducers/global';
import * as globalActions from '../actions/GlobalAction';
import { MidiManager } from '../utils/MidiManager';

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
        const action: globalActions.SendMidi = yield take('SEND_MIDI');
        const state: StateWithHistory<GlobalState> = yield select();
        const midiOutputName = state.present.config.midiOutputName;
        if (midiOutputName) {
            midiManager.note(midiOutputName, action.noteOn, action.channel, action.note, action.velocity);
        }
    }
}