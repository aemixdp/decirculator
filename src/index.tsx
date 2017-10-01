import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { take } from 'redux-saga/effects';
import { rootReducer } from './reducers/rootReducer';
import { AppContainer } from './containers/AppContainer';
import { circuitSaga } from './sagas/circuitSaga';
import { midiSaga } from './sagas/midiSaga';
import { themeSaga } from './sagas/themeSaga';
import { globalSaga } from './sagas/globalSaga';
import { GlobalState } from './reducers/globalReducer';
import { fontAwesomeOnLoad } from './utils/textUtils';
import builtins from './builtins';
import './index.css';

for (const key in builtins) {
    const value = builtins[key];
    localStorage.setItem(key, JSON.stringify(value));
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore<any>(rootReducer, {
    simulationState: 'STOPPED',
    circuitObjects: {
        idCounter: 0,
        wires: [],
        blocks: [],
        blockById: {},
        blocksBeforeSimulation: {},
        copyBufferBlockIds: new Set(),
    },
    ui: {
        viewportOffset: { x: 0, y: 0 },
        selectedObjectIds: new Set(),
        pivotPosition: { x: 0, y: 0 },
    },
    config: {
        circuitName: 'New circuit',
        midiOutputName: '',
        bpm: 130,
        gateLength: 100,
    },
    circuits: Object.keys(localStorage),
    midiOutputs: [],
} as GlobalState, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(function* () {
    while (true) {
        console.log(yield take());
    }
});

sagaMiddleware.run(themeSaga);
sagaMiddleware.run(circuitSaga);
sagaMiddleware.run(midiSaga);
sagaMiddleware.run(globalSaga);

fontAwesomeOnLoad(() => {
    render(
        <Provider store={store}>
            <AppContainer />
        </Provider>,
        document.getElementById('mount')
    );
});