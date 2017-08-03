import React from 'react';
import { Text } from 'react-konva';
import Block from '../../components/Block';
import utils from '../../utils';

export default {
    name: 'Clock',
    initialData: {
        beats: 1,
        noteFraction: 4,
    },
    tick: (circuit, blockId, delta, config) => {
        const timeUntilGateOn = circuit.timeUntilGateOn[blockId] -= delta;
        if (timeUntilGateOn <= 0) {
            const offset = blockId * 4;
            for (let i = 0; i < 4; i += 1) {
                if (circuit.input[offset + i] === -1) {
                    circuit.outputGate[offset + i] = true;
                }
            }
            circuit.timeUntilGateOn[blockId] =
                utils.music.noteToMs(circuit.beats[blockId], circuit.noteFraction[blockId], config.bpm);
        }
    },
    component: (props) =>
        <Block {...props}
            label="◷"
            labelX={12}
            labelY={7}
        >
            <Text key={1}
                text={props.beats}
                x={utils.text.offset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text
                key={2}
                text={props.noteFraction}
                x={utils.text.offset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}