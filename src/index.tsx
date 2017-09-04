import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { take } from 'redux-saga/effects';
import { rootReducer } from './reducers';
import { AppContainer } from './containers/AppContainer';
import { circuitSaga } from './sagas/circuitSaga';
import { midiSaga } from './sagas/midiSaga';
import { themeSaga } from './sagas/themeSaga';
import './index.css';

const sagaMiddleware = createSagaMiddleware();

const store = createStore<any>(rootReducer, {
    simulationState: 'STOPPED',
    circuitObjects: {
        idCounter: 0,
        wires: [],
        blocks: [],
        blockById: {},
        blocksBeforeSimulation: {},
    },
    ui: {
        viewportOffset: { x: 0, y: 0 },
    },
    config: {
        circuitName: 'New circuit',
        midiOutputName: '',
        bpm: 130,
    },
    circuits: Object.keys(localStorage),
    midiOutputs: [],
}, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(function* () {
    while (true) {
        console.log(yield take());
    }
});

sagaMiddleware.run(themeSaga);
sagaMiddleware.run(circuitSaga);
sagaMiddleware.run(midiSaga);

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('mount')
);