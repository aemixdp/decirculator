import React from 'react';
import { Layer, Line } from 'react-konva';

export default class extends React.Component {
    static snapToWireframe = (wireframeCellSize, props) => ({
        ...props,
        x: props.x - props.x % wireframeCellSize,
        y: props.y - props.y % wireframeCellSize,
    })
    render() {
        const c = this.props.wireframeCellSize;
        return (
            <Layer {...this.props}>
                {Array.from({ length: Math.floor(980 / c) }, (_, n) =>
                    <Line key={+n} stroke="gray" strokeWidth={0.1} points={[c * n - 1, 0, c * n - 1, 600]} />)}
                {Array.from({ length: Math.floor(610 / c) }, (_, n) =>
                    <Line key={-n} stroke="gray" strokeWidth={0.1} points={[0, c * n - 1, 960, c * n - 1]} />)}
            </Layer>
        );
    }
}