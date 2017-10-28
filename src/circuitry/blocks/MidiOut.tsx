import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';
import { expandNotes, expandVelocities } from '../../utils/musicUtils';

type State = {
    ccMode: boolean;
    channel: number;
    notes: string;
    currentNoteIndex: number;
    velocities: string;
    currentVelocityIndex: number;
    durations: string;
    currentDurationIndex: number;
};

export const MidiOut: BlockDescriptor<State> = {
    name: 'MidiOut',
    initialState: {
        ccMode: false,
        channel: 1,
        notes: 'C3',
        currentNoteIndex: 0,
        velocities: '100',
        currentVelocityIndex: 0,
        durations: '1/64',
        currentDurationIndex: 0,
    },
    statePropsToResetAfterSimulation: [
        'currentNoteIndex',
        'currentVelocityIndex',
        'currentDurationIndex',
    ],
    editableStateProps: [
        { propKey: 'ccMode', propLabel: 'cc', propType: 'boolean' },
        { propKey: 'channel', propType: 'number' },
        { propKey: 'notes', propType: 'notes' },
        { propKey: 'velocities', propType: 'velocities' },
        { propKey: 'durations', propType: 'intervals' },
    ],
    tick: (circuit, blockId, delta, config) => {
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && circuit.gate[inputId]) {
                const notes = circuit.notes[blockId];
                const currentNoteIndex = circuit.currentNoteIndex[blockId];
                const note = notes[currentNoteIndex];
                const velocities = circuit.velocities[blockId];
                const currentVelocityIndex = circuit.currentVelocityIndex[blockId];
                const velocity = velocities[currentVelocityIndex];
                const durations = circuit.durations[blockId];
                const currentDurationIndex = circuit.currentDurationIndex[blockId];
                const duration = durations[currentDurationIndex];
                const expireAt = Date.now() + duration / config.bpm;
                circuit.onMidiOut(circuit.ccMode[blockId], note, circuit.channel[blockId], velocity, expireAt);
                circuit.currentNoteIndex[blockId] = (currentNoteIndex + 1) % notes.length;
                circuit.currentVelocityIndex[blockId] = (currentVelocityIndex + 1) % velocities.length;
                circuit.currentDurationIndex[blockId] = (currentDurationIndex + 1) % durations.length;
                circuit.changed[blockId] = true;
                return;
            }
        }
    },
    component: (props) => {
        const ccText = props.ccMode ? 'cc' : '';
        const channelText = `${props.channel !== undefined ? props.channel : '1'}`;
        const noteText = `${props.notes !== undefined ? expandNotes(props.notes)[props.currentNoteIndex] : 'C3'}`;
        const velocityText = `${
            props.velocities !== undefined
                ? expandVelocities(props.velocities)[props.currentVelocityIndex]
                : '100'
            }`;
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
                    text={ccText}
                    x={4}
                    y={3}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={channelText}
                    x={textOffset(channelText, 40, 34, 29, 27, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={3}
                    text={noteText}
                    x={textOffset(noteText, 40, 34, 29, 27, 18, 12, 6)}
                    y={26}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={4}
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
