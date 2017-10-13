import React from 'react';
import { mangle } from '../utils/textUtils';
import { CircuitObject } from '../data/CircuitObject';
import blockDescriptors from '../circuitry/blocks';

const PROP_TYPE_INPUT_TYPE = {
    'number': 'text',
    'note-list': 'text',
    'delay-list': 'text',
    'boolean': 'checkbox',
};

type EventListeners = {
    onPropertyClick: (event: React.MouseEvent<any>) => void,
    onPropertyChange: (event: React.ChangeEvent<any>, block: CircuitObject, propName: string, propValue: any) => void,
};

type Props = EventListeners & CircuitObject;

export class Properties extends React.Component<Props, any> {
    static defaultProps: EventListeners = {
        onPropertyChange: () => { },
        onPropertyClick: () => { },
    };
    handlePropertyChange = (event: React.ChangeEvent<any>) => {
        const propName = event.target.dataset.prop;
        let propValue;
        if (event.target.type === 'text') {
            propValue = parseInt(event.target.value, 10);
            if (isNaN(propValue)) {
                return;
            }
        } else if (event.target.type === 'checkbox') {
            propValue = event.target.checked;
        }
        this.props.onPropertyChange(event, this.props, propName, propValue);
    }
    handlePropertyClick = (event: React.MouseEvent<any>) => {
        this.props.onPropertyClick(event);
    }
    render() {
        const editableProps =
            this.props.kind === 'block'
                ? blockDescriptors[this.props.name].editableStateProps
                : [];
        return (
            <div className="object-properties">
                {!this.props.hasOwnProperty('id') ? [] : [
                    <input
                        key="active"
                        type="checkbox"
                        data-prop="active"
                        data-value="checked"
                        checked={this.props.active}
                        onChange={this.handlePropertyChange}
                        onClick={this.handlePropertyClick}
                    />,
                    <span key="name">
                        [{this.props.kind === 'block' ? this.props.name : 'Wire'}]
                    </span>,
                ]}
                {editableProps.map(prop =>
                    <div className="h-box" key={prop.propKey}>
                        <span className="property-name">
                            {mangle(prop.propKey)}:
                        </span>
                        <input
                            type={PROP_TYPE_INPUT_TYPE[prop.propType]}
                            className="property-value"
                            data-prop={prop.propKey}
                            value={this.props[prop.propKey]}
                            checked={this.props[prop.propKey]}
                            onChange={this.handlePropertyChange}
                            onClick={this.handlePropertyClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}
