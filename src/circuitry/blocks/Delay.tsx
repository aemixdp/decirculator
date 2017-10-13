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
    dynamicStateKeys: [],
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
    component: (props) =>
        <Block
            {...props}
            label={'\uf250'}
            labelX={14}
            labelY={12}
            labelFontSize={26}
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
