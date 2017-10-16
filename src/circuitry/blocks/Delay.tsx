import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';

type State = {
    intervals: string;
    currentIntervalIndex: number;
};

export const Delay: BlockDescriptor<State> = {
    name: 'Delay',
    initialState: {
        intervals: '1/4',
        currentIntervalIndex: 0,
    },
    statePropsToResetAfterSimulation: [],
    editableStateProps: [
        { propKey: 'intervals', propType: 'intervals' },
    ],
    tick: (circuit, blockId, delta, config) => {
        const offset = blockId * 4;
        const delayList = circuit.delayList[blockId];
        const eta = delayList.tick(delta);
        if (eta <= 0) {
            circuit.compensation[blockId] = eta;
            for (let i = 0; i < 4; i += 1) {
                if (circuit.input[offset + i] === -1) {
                    circuit.outputGate[offset + i] = true;
                }
            }
        }
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                const intervals = circuit.intervals[blockId];
                const currentIntervalIndex = circuit.currentIntervalIndex[blockId];
                const delay = intervals[currentIntervalIndex] / config.bpm;
                delayList.add(delay + circuit.compensation[inputId] - delta);
                circuit.currentIntervalIndex[blockId] = (currentIntervalIndex + 1) % intervals.length;
                circuit.changed[blockId] = true;
                circuit.cooldown[inputId] = true;
                break;
            }
        }
    },
    component: (props) => {
        const intervalText = `${
            props.intervals === undefined
                ? '1/4'
                : props.intervals.split(',')[props.currentIntervalIndex]
            }`;
        return (
            <Block
                {...props}
                label={'\uf250'}
                labelX={16}
                labelY={14}
                labelFontSize={22}
            >
                <Text
                    key={2}
                    text={intervalText}
                    x={textOffset(intervalText, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                {/*  */}
            </Block>
        );
    }
};
