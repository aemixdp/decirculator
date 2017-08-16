import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    current: number;
    steps: number;
};

export const Counter: BlockDescriptor<State> = {
    name: 'Counter',
    initialState: {
        current: 0,
        steps: 4,
    },
    dynamicStateKeys: ['current'],
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                const newCurrent = circuit.counterValue[blockId] += 1;
                if (newCurrent >= circuit.counterSteps[blockId]) {
                    for (let j = 0; j < 4; j += 1) {
                        if (circuit.input[offset + j] === -1) {
                            circuit.outputGate[offset + j] = true;
                        }
                    }
                    circuit.counterValue[blockId] = 0;
                }
                circuit.changed[blockId] = true;
                circuit.cooldown[inputId] = true;
            }
        }
    },
    component: (props) =>
        <Block
            {...props}
            label={'\uf055'}
            labelX={13}
            labelY={11}
        >
            <Text
                key={1}
                text={`${props.current !== undefined ? props.current : ''}`}
                x={textOffset(props.current, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text
                key={2}
                text={`${props.steps !== undefined ? props.steps : ''}`}
                x={textOffset(props.steps, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
};