import React from 'react';
import { CircuitObject } from '../data/CircuitObject';
import { mangle } from '../utils/textUtils';
import { parseNoteList } from '../utils/musicUtils';
import blockDescriptors from '../circuitry/blocks';

const INPUT_TYPE_BY_PROP_TYPE = {
    'boolean': 'checkbox',
    'number': 'text',
    'notes': 'text',
    'delays': 'text',
};

const PARSER_BY_PROP_TYPE = {
    'number': (value: string) => parseInt(value, 10),
    'notes': (value: string) => parseNoteList(value) && value,
    'delays': (value: string) => parseInt(value, 10),
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
        const propName = event.target.dataset.propName;
        const propType = event.target.dataset.propType;
        const propValue = event.target.type === 'text'
            ? PARSER_BY_PROP_TYPE[propType](event.target.value)
            : event.target.checked;
        if (propValue || propValue === false) {
            this.props.onPropertyChange(event, this.props, propName, propValue);
        }
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
                <input
                    key="active"
                    type="checkbox"
                    data-prop-name="active"
                    data-prop-type="boolean"
                    data-value="checked"
                    checked={this.props.active}
                    onChange={this.handlePropertyChange}
                    onClick={this.handlePropertyClick}
                />
                <span key="name">
                    [{this.props.kind === 'block' ? this.props.name : 'Wire'}]
                </span>
                {editableProps.map(prop =>
                    <div className="h-box" key={prop.propKey}>
                        <span className="property-name">
                            {mangle(prop.propLabel || prop.propKey)}:
                        </span>
                        <input
                            type={INPUT_TYPE_BY_PROP_TYPE[prop.propType]}
                            className="property-value"
                            data-prop-name={prop.propKey}
                            data-prop-type={prop.propType}
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
