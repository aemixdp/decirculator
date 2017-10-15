import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    channel: number;
    notes: string;
    currentNoteIndex: number;
    velocity: number;
};

export const MidiOut: BlockDescriptor<State> = {
    name: 'MidiOut',
    initialState: {
        channel: 1,
        notes: 'C3',
        currentNoteIndex: 0,
        velocity: 100,
    },
    statePropsToResetAfterSimulation: [],
    editableStateProps: [
        { propKey: 'channel', propType: 'number' },
        { propKey: 'notes', propType: 'note-list' },
        { propKey: 'velocity', propType: 'number' },
    ],
    tick: (circuit, blockId, delta, config) => {
        if (circuit.cooldown[blockId]) {
            const timeUntilTurnOff = circuit.timeUntilTurnOff[blockId] -= delta;
            if (timeUntilTurnOff <= 0) {
                const note = circuit.notes[blockId][circuit.currentNoteIndex[blockId]];
                circuit.onMidiOut(false, note, circuit.channel[blockId], circuit.velocity[blockId]);
                circuit.cooldown[blockId] = false;
            }
        }
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                const notes = circuit.notes[blockId];
                const currentNoteIndex = circuit.currentNoteIndex[blockId];
                const note = notes[currentNoteIndex];
                circuit.onMidiOut(true, note, circuit.channel[blockId], circuit.velocity[blockId]);
                circuit.currentNoteIndex[blockId] = (currentNoteIndex + 1) % notes.length;
                circuit.timeUntilTurnOff[blockId] = config.gateLength;
                circuit.changed[blockId] = true;
                circuit.cooldown[blockId] = true;
                circuit.cooldown[inputId] = true;
                return;
            }
        }
    },
    component: (props) => {
        const channelText = `${props.channel !== undefined ? props.channel : 'ch'}`;
        const noteText = `${props.notes !== undefined ? props.notes.split(',')[props.currentNoteIndex] : 'no'}`;
        const velocityText = `${props.velocity !== undefined ? props.velocity : 've'}`;
        return (
            <Block
                {...props}
                label={'\uf176'}
                labelX={14}
                labelY={9}
                labelFontSize={30}
            >
                <Text
                    key={1}
                    text={channelText}
                    x={textOffset(channelText, 40, 34, 29, 27, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={noteText}
                    x={textOffset(noteText, 40, 34, 29, 27, 18, 12, 6)}
                    y={26}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={3}
                    text={velocityText}
                    x={textOffset(velocityText, 40, 34, 29, 27, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
            </Block>
        );
    }
};
