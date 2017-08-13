import React from 'react';
import { Layer, Line } from 'react-konva';
import { Point } from '../data/Point';

type Props = {
    x: number;
    y: number;
    theme: any;
    wireframeCellSize: number;
};

export function snapToWireframe<T extends Point>(wireframeCellSize: number, object: T): T {
    return {
        ...object as any,
        x: object.x - object.x % wireframeCellSize,
        y: object.y - object.y % wireframeCellSize,
    };
}

export class Wireframe extends React.Component<Props, any> {
    render() {
        const c = this.props.wireframeCellSize;
        return (
            <Layer {...this.props}>
                {Array.from({ length: Math.floor(980 / c) }, (_, n) =>
                    <Line
                        key={+n}
                        stroke={this.props.theme.wireframeColor}
                        strokeWidth={0.1}
                        points={[c * n - 1, 0, c * n - 1, 600]}
                    />
                )}
                {Array.from({ length: Math.floor(610 / c) }, (_, n) =>
                    <Line
                        key={-n}
                        stroke={this.props.theme.wireframeColor}
                        strokeWidth={0.1}
                        points={[0, c * n - 1, 960, c * n - 1]}
                    />
                )}
            </Layer>
        );
    }
}