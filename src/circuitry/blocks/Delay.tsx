import React from 'react';
import { Text } from 'react-konva';
import { Block } from '../../components/Block';
import { BlockDescriptor } from '../../data/BlockDescriptor';
import { offset } from '../../utils/textUtils';
import { noteToMs } from '../../utils/musicUtils';

type State = {
    beats: number;
    noteFraction: number;
}

export const Delay: BlockDescriptor<State> = {
    name: 'Delay',
    initialState: {
        beats: 1,
        noteFraction: 4,
    },
    tick: (circuit, blockId, delta, config) => {
        const delayList = circuit.delayList[blockId];
        const offset = blockId * 4;
        if (delayList.tick(delta)) {
            for (let i = 0; i < 4; i += 1) {
                if (circuit.input[offset + i] === -1) {
                    circuit.outputGate[offset + i] = true;
                }
            }
        }
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                delayList.add(noteToMs(circuit.beats[blockId], circuit.noteFraction[blockId], config.bpm));
                circuit.cooldown[inputId] = true;
                break;
            }
        }
    },
    component: (props) =>
        <Block {...props}
            label={'\uf250'}
            labelX={14}
            labelY={12}
            labelFontSize={26}
        >
            <Text key={1}
                text={`${props.beats || ''}`}
                x={offset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text key={2}
                text={`${props.noteFraction || ''}`}
                x={offset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}