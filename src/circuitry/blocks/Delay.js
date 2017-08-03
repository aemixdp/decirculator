import React from 'react';
import { Text } from 'react-konva';
import Block from '../../components/Block';
import utils from '../../utils';

export default {
    name: 'Delay',
    initialData: {
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
                delayList.add(utils.music.noteToMs(circuit.beats[blockId], circuit.noteFraction[blockId], config.bpm));
                circuit.cooldown[inputId] = true;
                break;
            }
        }
    },
    component: (props) =>
        <Block {...props}
            label="⧖"
            labelX={13}
            labelY={6}
            labelFontSize={34}
        >
            <Text key={1}
                text={props.beats}
                x={utils.text.offset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text key={2}
                text={props.noteFraction}
                x={utils.text.offset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}