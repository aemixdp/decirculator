import React from 'react';
import { mangle } from '../utils/textUtils';
import { objectEntries } from '../utils/objectUtils';
import { CircuitObject } from '../data/CircuitObject';

const excludedProps = {
    id: true,
    kind: true,
    name: true,
    x: true,
    y: true,
    ports: true,
    startPosition: true,
    startPortInfo: true,
    endPosition: true,
    endPortInfo: true,
    label: true,
    active: true,
    isSelected: true,
    children: true,
    hoveringPort: true,
    theme: true,
    labelX: true,
    labelY: true,
    labelFontSize: true,
    tick: true,
    gate: true,
};

const booleanProps = {
    skipFirstGate: true,
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
        const filteredProps = objectEntries<any>(this.props)
            .filter(([key, value]) =>
                key.indexOf('on') !== 0 &&
                !excludedProps[key]
            );
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
                        [{this.props.kind === 'block' ? this.props.name : 'wire'}]
                    </span>,
                ]}
                {filteredProps.map(([key, value]) =>
                    <div className="h-box" key={key}>
                        <span className="property-name">
                            {mangle(key)}:
                        </span>
                        <input
                            type={booleanProps[key] ? 'checkbox' : 'text'}
                            className="property-value"
                            data-prop={key}
                            value={value}
                            checked={value}
                            onChange={this.handlePropertyChange}
                            onClick={this.handlePropertyClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}