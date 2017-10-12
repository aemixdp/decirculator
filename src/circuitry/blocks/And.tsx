import React from 'react';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';

export const And: BlockDescriptor<{}> = {
    name: 'And',
    initialState: {},
    dynamicStateKeys: [],
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        let conjunction = true;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            conjunction = conjunction && (inputId === -1 || circuit.gate[inputId]);
        }
        for (let i = 0; i < 4; i += 1) {
            if (circuit.input[offset + i] === -1) {
                circuit.outputGate[offset + i] = conjunction;
            }
        }
    },
    component: (props) =>
        <Block
            {...props}
            label="&"
            labelX={15}
            labelY={10}
        />
};
