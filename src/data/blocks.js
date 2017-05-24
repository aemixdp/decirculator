import React from 'react';
import { Text } from 'react-konva';
import Block from '../components/Block';

export default [
    {
        name: 'start',
        data: {},
        component: (props) =>
            <Block label="S" {...props} />
    },
    {
        name: 'clock-relative',
        data: {
            beats: 1,
            noteFraction: 4,
        },
        component: (props) =>
            <Block label="C" {...props}>
                <Text key={1} text={props.beats} x={25} y={11} fill={props.theme.blockTextColor} />
                <Text key={2} text={props.noteFraction} x={25} y={27} fill={props.theme.blockTextColor} />
            </Block>
    },
    {
        name: 'clock-absolute',
        data: {
            delayTime: 100,
        },
        component: (props) =>
            <Block label="C" {...props}>
                <Text key={1} text="ms" x={27} y={11} fill={props.theme.blockTextColor} />
                <Text key={2} text={props.delayTime} x={25} y={27} fill={props.theme.blockTextColor} />
            </Block>
    },
    {
        name: 'delay-relative',
        data: {
            beats: 1,
            noteFraction: 4,
        },
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text={props.beats} x={25} y={11} fill={props.theme.blockTextColor} />
                <Text key={2} text={props.noteFraction} x={25} y={27} fill={props.theme.blockTextColor} />
            </Block>
    },
    {
        name: 'delay-absolute',
        data: {
            delayTime: 100,
        },
        component: (props) =>
            <Block label="D" {...props}>
                <Text key={1} text="ms" x={27} y={11} fill={props.theme.blockTextColor} />
                <Text key={2} text={props.delayTime} x={25} y={27} fill={props.theme.blockTextColor} />
            </Block>
    },
    {
        name: 'midi-out',
        data: {
            channel: 1,
            value: 64,
        },
        component: (props) =>
            <Block label="M" {...props}>
                <Text key={1} text={props.channel} x={27} y={11} fill={props.theme.blockTextColor} />
                <Text key={2} text={props.value} x={27} y={27} fill={props.theme.blockTextColor} />
            </Block>
    },
];