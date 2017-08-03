import React from 'react';
import Block from '../../components/Block';

const PlayBlock = {
    name: 'Play',
    initialData: {},
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
            labelY={8}
        />
};

export default PlayBlock;