import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    channel: number;
    note: number;
    velocity: number;
};

export const MidiOut: BlockDescriptor<State> = {
    name: 'MidiOut',
    initialState: {
        channel: 1,
        note: 64,
        velocity: 100,
    },
    dynamicStateKeys: [],
    editableStateProps: [
        { propKey: 'channel', propType: 'number' },
        { propKey: 'note', propType: 'number' },
        { propKey: 'velocity', propType: 'number' },
    ],
    tick: (circuit, blockId, delta, config) => {
        if (circuit.cooldown[blockId]) {
            const timeUntilTurnOff = circuit.timeUntilTurnOff[blockId] -= delta;
            if (timeUntilTurnOff <= 0) {
                circuit.onMidiOut(false, circuit.note[blockId], circuit.channel[blockId], circuit.velocity[blockId]);
                circuit.cooldown[blockId] = false;
            }
        }
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                circuit.onMidiOut(true, circuit.note[blockId], circuit.channel[blockId], circuit.velocity[blockId]);
                circuit.timeUntilTurnOff[blockId] = config.gateLength;
                circuit.changed[blockId] = true;
                circuit.cooldown[blockId] = true;
                circuit.cooldown[inputId] = true;
                return;
            }
        }
    },
    component: (props) =>
        <Block
            {...props}
            label={'\uf176'}
            labelX={18}
            labelY={9}
            labelFontSize={30}
        >
            <Text
                key={1}
                text={`${props.channel !== undefined ? props.channel : ''}`}
                x={textOffset(props.channel, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text
                key={2}
                text={`${props.note !== undefined ? props.note : ''}`}
                x={textOffset(props.note, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
};
