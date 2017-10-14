import React from 'react';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';

export const Or: BlockDescriptor<{}> = {
    name: 'Or',
    initialState: {},
    statePropsToResetAfterSimulation: [],
    editableStateProps: [],
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        let disjunction = false;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            disjunction = disjunction || circuit.gate[inputId];
        }
        for (let i = 0; i < 4; i += 1) {
            if (circuit.input[offset + i] === -1) {
                circuit.outputGate[offset + i] = disjunction;
            }
        }
    },
    component: (props) =>
        <Block
            {...props}
            label={'\uf047'}
            labelX={11}
            labelY={11}
        />
};
