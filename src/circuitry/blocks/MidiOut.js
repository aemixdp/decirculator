import React from 'react';
import { Text } from 'react-konva';
import Block from '../../components/Block';
import utils from '../../utils';

export default {
    name: 'MidiOut',
    initialData: {
        channel: 1,
        value: 64,
    },
    tick: (circuit, blockId) => {
        const offset = blockId * 4;
        for (let i = 0; i < 4; i += 1) {
            const inputId = circuit.input[offset + i];
            if (inputId !== -1 && !circuit.cooldown[inputId] && circuit.gate[inputId]) {
                circuit.gate[blockId] = true;
                circuit.changed[blockId] = true;
                circuit.cooldown[inputId] = true;
                return;
            }
        }
    },
    component: (props) =>
        <Block {...props}
            label="↑"
            labelX={15}
            labelY={2}
            labelFontSize={38}
        >
            <Text key={1}
                text={props.channel}
                x={utils.text.offset(props.channel, 40, 34, 30, 24, 18, 12, 6)}
                y={4}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
            <Text key={2}
                text={props.value}
                x={utils.text.offset(props.value, 40, 34, 30, 24, 18, 12, 6)}
                y={37}
                fill={props.theme.blockTextColor}
                fontFamily={props.theme.font}
                fontSize={10}
            />
        </Block>
}