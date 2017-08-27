import { connect } from 'react-redux';
import { App } from '../components/App';
import { GlobalState } from '../reducers/global';

export const AppContainer = connect(
    (state: GlobalState, ownProps: any) => ({
        theme: state.theme,
        viewportOffset: state.ui.viewportOffset,
        selectedObject: state.ui.selectedObject,
        newBlock: state.ui.newBlock,
        newWire: state.ui.newWire,
        hoveringPortInfo: state.ui.hoveringPortInfo,
        isHoveringPort: state.ui.hoveringPortInfo !== undefined,
        wires: state.circuitObjects.wires,
        blocks: state.circuitObjects.blocks,
        blockById: state.circuitObjects.blockById,
        circuitName: state.config.circuitName,
        bpm: state.config.bpm,
        simulationState: state.simulationState,
        circuits: state.circuits,
        midiOutputName: state.config.midiOutputName,
        midiOutputs: state.midiOutputs,
    }),
    (dispatch) => ({ dispatch }),
)(App as any);