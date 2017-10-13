import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';
import { noteToMs } from '../../utils/musicUtils';

type State = {
    beats: number;
    noteFraction: number;
    skipFirstGate: boolean;
};

export const Clock: BlockDescriptor<State> = {
    name: 'Clock',
    initialState: {
        beats: 1,
        noteFraction: 4,
        skipFirstGate: false,
    },
    dynamicStateKeys: [],
    editableStateProps: [
        { propKey: 'skipFirstGate', propType: 'boolean' },
        { propKey: 'beats', propType: 'number' },
        { propKey: 'noteFraction', propType: 'number' },
    ],
    tick: (circuit, blockId, delta, config) => {
        const timeUntilTurnOn = circuit.timeUntilTurnOn[blockId] -= delta;
        if (timeUntilTurnOn <= 0) {
            const offset = blockId * 4;
            for (let i = 0; i < 4; i += 1) {
                if (circuit.input[offset + i] === -1) {
                    circuit.outputGate[offset + i] = true;
                }
            }
            circuit.timeUntilTurnOn[blockId] =
                noteToMs(circuit.beats[blockId], circuit.noteFraction[blockId], config.bpm);
        }
    },
    component: (props) =>
        <Block
            {...props }
            label={'\uf017'}
            labelX={13}
            labelY={11}
        >
            <Text
                key={1}
                text={`${props.beats !== undefined ? props.beats : ''}`}
                x={textOffset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text
                key={2}
                text={`${props.noteFraction !== undefined ? props.noteFraction : ''}`}
                x={textOffset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
};
