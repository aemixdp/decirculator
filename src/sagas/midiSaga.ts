import * as globalActions from '../actions/GlobalAction';
import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { MidiManager } from '../utils/MidiManager';

export function* midiSaga() {
    let midiManager: MidiManager;
    const chan = eventChannel(emitter => {
        midiManager = new MidiManager({
            onOutputsChange: () =>
                emitter(globalActions.invalidateMidiOutputs(Object.keys(midiManager.midiOutputs)))
        });
        return () => { };
    });
    while (true) {
        yield put(yield take(chan));
    }
}