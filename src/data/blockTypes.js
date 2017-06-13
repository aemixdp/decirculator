import React from 'react';
import { Text } from 'react-konva';
import Block from '../components/Block';

const offset = (n, ...offsets) =>
    offsets[Math.max(`${n}`.length - 1, 0)] ||
    offsets[offsets.length - 1];

const noteToMs = (beats, noteFraction, bpm) => 111;

export default {
    'play': {
        name: 'play',
        initialData: {},
        initialState: () => ({
            gate: false,
        }),
        tick: () => { },
        component: (props) =>
            <Block {...props}
                label="▶"
                labelX={13}
                labelY={11}
            />
    },
    'clock': {
        name: 'clock',
        initialData: {
            beats: 1,
            noteFraction: 4,
        },
        initialState: (state, data, config) => ({
            gate: false,
            timeUntilGateOn: 0,
            timeUntilGateOff: 0,
        }),
        tick: (delta, state, data, config) => {
            const newTimeUntilGateOn = state.timeUntilGateOn[data.id] - delta;
            const newTimeUntilGateOff = state.timeUntilGateOff[data.id] - delta;
            const oldGate = state.gate[data.id];
            const newGate = oldGate
                ? newTimeUntilGateOff > 0
                : newTimeUntilGateOn <= 0;
            state.gate[data.id] = newGate;
            state.timeUntilGateOn[data.id] = (!newGate && oldGate)
                ? noteToMs(data.beats, data.noteFraction, config.bpm)
                : newTimeUntilGateOn;
            state.timeUntilGateOff[data.id] = (newGate && !oldGate)
                ? 50
                : newTimeUntilGateOff;
        },
        component: (props) =>
            <Block {...props}
                label="◷"
                labelX={12}
                labelY={11}
            >
                <Text key={1}
                    text={props.beats}
                    x={offset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
                <Text
                    key={2}
                    text={props.noteFraction}
                    x={offset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
            </Block>
    },
    'delay': {
        name: 'delay',
        initialData: () => ({
            beats: 1,
            noteFraction: 4,
        }),
        tick: (delta, state, data, config) => {

        },
        component: (props) =>
            <Block {...props}
                label="⧖"
                labelX={16}
                labelY={7}
                labelFontSize={34}
            >
                <Text key={1}
                    text={props.beats}
                    x={offset(props.beats, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
                <Text key={2}
                    text={props.noteFraction}
                    x={offset(props.noteFraction, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
            </Block>
    },
    'midi-out': {
        name: 'midi-out',
        initialData: {
            channel: 1,
            value: 64,
        },
        component: (props) =>
            <Block {...props}
                label="↑"
                labelX={17}
                labelY={7}
            >
                <Text key={1}
                    text={props.channel}
                    x={offset(props.channel, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
                <Text key={2}
                    text={props.value}
                    x={offset(props.value, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
            </Block>
    },
    'counter': {
        name: 'counter',
        initialData: {
            current: 1,
            steps: 4,
        },
        component: (props) =>
            <Block  {...props}
                label="⊕"
                labelX={10}
                labelY={9}
            >
                <Text key={1}
                    text={props.current}
                    x={offset(props.current, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
                <Text key={2}
                    text={props.steps}
                    x={offset(props.steps, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
            </Block>
    },
    'switch': {
        name: 'switch',
        initialData: {
            current: 1,
            steps: 4,
        },
        component: (props) =>
            <Block  {...props}
                label="⤬"
                labelX={12}
                labelY={7}
                labelFontSize={37}
            >
                <Text key={1}
                    text={props.current}
                    x={offset(props.current, 40, 34, 30, 24, 18, 12, 6)}
                    y={4}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
                <Text key={2}
                    text={props.steps}
                    x={offset(props.steps, 40, 34, 30, 24, 18, 12, 6)}
                    y={37}
                    fill={props.theme.blockTextColor}
                    fontFamily="Helvetica"
                    fontSize={10}
                />
            </Block>
    },
    'and': {
        name: 'and',
        initialData: {},
        component: (props) =>
            <Block {...props}
                label="&"
                labelX={15}
                labelY={11}
            />
    },
};