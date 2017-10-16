import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    skipFirstGate: boolean;
    intervals: string;
    currentIntervalIndex: number;
};

export const Clock: BlockDescriptor<State> = {
    name: 'Clock',
    initialState: {
        skipFirstGate: false,
        intervals: '1/4',
        currentIntervalIndex: 0,
    },
    statePropsToResetAfterSimulation: [],
    editableStateProps: [
        { propKey: 'skipFirstGate', propType: 'boolean', propLabel: 'skipInit' },
        { propKey: 'intervals', propType: 'intervals' },
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
            const intervals = circuit.intervals[blockId];
            const currentIntervalIndex = circuit.currentIntervalIndex[blockId];
            circuit.timeUntilTurnOn[blockId] = intervals[currentIntervalIndex] / config.bpm;
            circuit.currentIntervalIndex[blockId] = (currentIntervalIndex + 1) % intervals.length;
            circuit.changed[blockId] = true;
        }
    },
    component: (props) => {
        const statusText = 'on';
        const intervalText = `${
            props.intervals === undefined
                ? '1/4'
                : props.intervals.split(',')[props.currentIntervalIndex]
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
                    text={statusText}
                    x={textOffset(statusText, 40, 34, 30, 24, 18, 12, 6)}
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
