import React from 'react';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';

export const Play: BlockDescriptor<{}> = {
    name: 'Play',
    initialState: {},
    tick: (circuit, blockId) => {
        if (!circuit.playFired[blockId]) {
            const offset = blockId * 4;
            for (let i = 0; i < 4; i += 1) {
                if (circuit.input[offset + i] === -1) {
                    circuit.outputGate[offset + i] = true;
                }
            }
            circuit.playFired[blockId] = true;
        }
    },
    component: (props) =>
        <Block {...props}
            label="▶"
            labelX={14}
            labelY={10}
            labelFontSize={32}
        />
};