import { connect } from 'react-redux';
import { StateWithHistory } from 'redux-undo';
import { App } from '../components/App';
import { GlobalState } from '../reducers/globalReducer';

export const AppContainer = connect(
    (state: StateWithHistory<GlobalState>) => {
        const present = state.present;
        return {
            theme: present.theme,
            viewportOffset: present.ui.viewportOffset,
            selectedObjectIds: present.ui.selectedObjectIds,
            newBlock: present.ui.newBlock,
            newWire: present.ui.newWire,
            hoveringPortInfo: present.ui.hoveringPortInfo,
            isHoveringPort: present.ui.hoveringPortInfo !== undefined,
            wires: present.circuitObjects.wires,
            blocks: present.circuitObjects.blocks,
            blockById: present.circuitObjects.blockById,
            circuitName: present.config.circuitName,
            bpm: present.config.bpm,
            simulationState: present.simulationState,
            circuits: present.circuits,
            midiOutputName: present.config.midiOutputName,
            midiOutputs: present.midiOutputs,
        };
    },
    (dispatch) => ({ dispatch }),
)(App as any);