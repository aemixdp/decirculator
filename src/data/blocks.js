import React from 'react';
import { Text } from 'react-konva';
import Block from '../components/Block';

export default [
    {
        name: 'start',
        label: 'Start',
        component: (props) =>
            <Block label="S" {...props} />
    },
    {
        name: 'pulse-relative',
        label: 'Pulse (rel)',
        component: (props) =>
            <Block label="P" {...props}>
                <Text key={1} text="1" x={25} y={11} />
                <Text key={2} text="4" x={25} y={27} />
            </Block>
    },
    {
        name: 'pulse-absolute',
        label: 'Pulse (abs)',
        component: (props) =>
            <Block label="P" {...props}>
                <Text key={1} text="ms" x={27} y={11} />
                <Text key={2} text="100" x={25} y={27} />
            </Block>
    },
    {
        name: 'delay-relative',
        label: 'Delay (rel)',
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text="1" x={25} y={11} />
                <Text key={2} text="4" x={25} y={27} />
            </Block>
    },
    {
        name: 'delay-absolute',
        label: 'Delay (abs)',
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text="ms" x={27} y={11} />
                <Text key={2} text="100" x={25} y={27} />
            </Block>
    },
    {
        name: 'midi-out',
        label: 'Midi out',
        component: (props) =>
            <Block label="M" {...props}>
                <Text key={1} text="1" x={28} y={11} />
                <Text key={2} text="64" x={28} y={27} />
            </Block>
    },
];