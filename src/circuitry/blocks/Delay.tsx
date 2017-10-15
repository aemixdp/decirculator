import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { textOffset } from '../../utils/textUtils';
import { noteToMs } from '../../utils/musicUtils';

type State = {
    beats: number;
    noteFraction: number;
};

export const Delay: BlockDescriptor<State> = {
    name: 'Delay',
    initialState: {
        beats: 1,
        noteFraction: 4,
    },
    statePropsToResetAfterSimulation: [],
    editableStateProps: [
        { propKey: 'beats', propType: 'number' },
        { propKey: 'noteFraction', propType: 'number' },
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
                const delay = noteToMs(circuit.beats[blockId], circuit.noteFraction[blockId], config.bpm);
                delayList.add(delay + circuit.compensation[inputId] - delta);
                circuit.cooldown[inputId] = true;
                break;
            }
        }
    },
    component: (props) => {
        const beatsText = `${props.beats !== undefined ? props.beats : 'be'}`;
        const noteFractionText = `${props.noteFraction !== undefined ? props.noteFraction : 'nF'}`;
        return (
            <Block
                {...props}
                label={'\uf250'}
                labelX={16}
                labelY={14}
                labelFontSize={22}
            >
                <Text
                    key={1}
                    text={beatsText}
                    x={textOffset(beatsText, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={noteFractionText}
                    x={textOffset(noteFractionText, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily={props.theme.font}
                    fontSize={10}
                />
            </Block>
        );
    }
};
