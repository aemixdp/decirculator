import React from 'react';
import { Stage, Layer } from 'react-konva';
import Block from './Block';

export default class BlockButton extends React.Component {
    static defaultProps = {
        onDragStart: () => { },
        onDragEnd: () => { },
        onDragMove: () => { },
    }
    handleDragStart = (e) => {
        this.props.onDragStart(e, this.props);
    }
    handleDragEnd = (e) => {
        this.props.onDragEnd(e, this.props);
    }
    handleDragMove = (e) => {
        this.props.onDragMove(e, this.props);
    }
    render() {
        return (
            <Stage
                className="block-type-button"
                width={54}
                height={54}
            >
                <Layer>
                    <this.props.component {...this.props.data}
                        theme={this.props.theme}
                        active="true"
                        ports={Block.DefaultPorts}
                        x={2}
                        y={2}
                        draggable="true"
                        onDragStart={this.handleDragStart}
                        onDragEnd={this.handleDragEnd}
                        onDragMove={this.handleDragMove}
                    />
                </Layer>
            </Stage>
        );
    }
}