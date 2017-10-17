import React from 'react';
import AutosizeInput from 'react-input-autosize';
import { CircuitObject } from '../data/CircuitObject';
import { mangle } from '../utils/textUtils';
import { parseNotes, parseIntervals } from '../utils/musicUtils';
import blockDescriptors from '../circuitry/blocks';

const PARSER_BY_PROP_TYPE = {
    'number': (value: string) => parseInt(value, 10),
    'numbers': (value: string) => {
        const numbers = value.split(',')
            .filter(s => s.length > 0)
            .map(s => parseInt(s, 10));
        return numbers.findIndex(isNaN) === -1
            ? numbers
            : null;
    },
    'notes': (value: string) => parseNotes(value) && value,
    'intervals': (value: string) => parseIntervals(value, 1) && value,
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
                {editableProps.map(prop => {
                    const commonInputProps = {
                        'data-prop-name': prop.propKey,
                        'data-prop-type': prop.propType,
                        className: 'property-value',
                        onChange: this.handlePropertyChange,
                        onClick: this.handlePropertyClick,
                    };
                    return (
                        <div className="h-box" key={prop.propKey}>
                            <span className="property-name">
                                {mangle(prop.propLabel || prop.propKey)}:
                        </span>
                            {
                                prop.propType === 'boolean'
                                    ?
                                    <input
                                        type="checkbox"
                                        checked={this.props[prop.propKey]}
                                        {...commonInputProps}
                                    />
                                    :
                                    <AutosizeInput
                                        value={this.props[prop.propKey]}
                                        {...commonInputProps}
                                    />
                            }

                        </div>
                    );
                })}
            </div>
        );
    }
}
