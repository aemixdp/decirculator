import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';
import { expandIntervals } from '../../utils/musicUtils';

type State = {
    ticking: boolean;
    skipFirstGate: boolean;
    intervals: string;
    currentIntervalIndex: number;
};

export const Clock: BlockDescriptor<State> = {
    name: 'Clock',
    initialState: {
        ticking: true,
        skipFirstGate: false,
        intervals: '1/4',
        currentIntervalIndex: 0,
    },
    statePropsToResetAfterSimulation: ['ticking'],
    editableStateProps: [
        { propKey: 'ticking', propType: 'boolean' },
        { propKey: 'skipFirstGate', propType: 'boolean', propLabel: 'skipInit' },
        { propKey: 'intervals', propType: 'intervals' },
    ],
    tick: (circuit, blockId, delta, config) => {
        const offset = blockId * 4;
        if (circuit.ticking[blockId]) {
            const timeUntilTurnOn = circuit.timeUntilTurnOn[blockId] -= delta;
            if (timeUntilTurnOn <= 0) {
                for (let i = 0; i < 4; i += 1) {
                    if (circuit.input[offset + i] === -1) {
                        circuit.outputGate[offset + i] = true;
                    }
                }
                const compensation = timeUntilTurnOn;
                circuit.compensation[blockId] = compensation;
                const intervals = circuit.intervals[blockId];
                const currentIntervalIndex = circuit.currentIntervalIndex[blockId];
                const delay = intervals[currentIntervalIndex] / config.bpm;
                circuit.timeUntilTurnOn[blockId] = delay + compensation;
                circuit.currentIntervalIndex[blockId] = (currentIntervalIndex + 1) % intervals.length;
                circuit.changed[blockId] = true;
            }
        }
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                circuit.ticking[blockId] = !circuit.ticking[blockId];
                circuit.changed[blockId] = true;
                circuit.cooldown[inputId] = true;
                return;
            }
        }
    },
    component: (props) => {
        const tickingText = props.ticking === false ? 'off' : 'on';
        const intervalText = `${
            props.intervals === undefined
                ? '1/4'
                : expandIntervals(props.intervals)[props.currentIntervalIndex]
            }`;
        return (
            <Block
                {...props }
                label={'\uf017'}
                labelX={13}
                labelY={11}
            >
                <Text
                    key={1}
                    text={tickingText}
                    x={textOffset(tickingText, 40, 34, 34, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={intervalText}
                    x={textOffset(intervalText, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
            </Block>
        );
    }
};
