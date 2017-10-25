import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    signature: string;
    skipBars: number;
};

export const Play: BlockDescriptor<State> = {
    name: 'Play',
    initialState: {
        signature: '4/4',
        skipBars: 0,
    },
    statePropsToResetAfterSimulation: [],
    editableStateProps: [
        { propKey: 'signature', propType: 'signature' },
        { propKey: 'skipBars', propType: 'number' },
    ],
    tick: (circuit, blockId, delta) => {
        if (!circuit.fired[blockId]) {
            const timeUntilTurnOn = circuit.timeUntilTurnOn[blockId] -= delta;
            if (timeUntilTurnOn <= 0) {
                const offset = blockId * 4;
                for (let i = 0; i < 4; i += 1) {
                    if (circuit.input[offset + i] === -1) {
                        circuit.outputGate[offset + i] = true;
                    }
                }
                circuit.fired[blockId] = true;
            }
        }
    },
    component: (props) => {
        const skipBarsText = `${props.skipBars || '0'}`;
        const signatureText = props.signature || '4/4';
        return (
            <Block
                {...props}
                label="▶"
                labelX={14}
                labelY={10}
                labelFontSize={32}
            >
                <Text
                    key={1}
                    text={skipBarsText}
                    x={textOffset(skipBarsText, 40, 34, 34, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={signatureText}
                    x={textOffset(signatureText, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
            </Block>
        );
    }
};
