import React from 'react';

const mangle = (str) => {
    const words = [];
    let word = '';
    for (let i = 0; i < str.length; ++i) {
        if (str[i] === str[i].toUpperCase()) {
            if (word.length > 0) words.push(word);
            word = str[i].toLowerCase();
        } else {
            word += str[i];
        }
    }
    if (word.length > 0) words.push(word);
    return words.join('-');
}

export default class Props extends React.Component {
    static defaultProps = {
        onPropertyChange: () => { },
        onPropertyClick: () => { },
    }
    static ExcludedProps = {
        id: true,
        kind: true,
        blockTypeName: true,
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
    }
    handlePropertyChange = (e) => {
        this.props.onPropertyChange(e,
            this.props,
            e.target.dataset.prop,
            e.target[e.target.dataset.value || 'value']
        );
    }
    handlePropertyClick = (e) => {
        this.props.onPropertyClick(e);
    }
    render() {
        const filteredProps = Object.entries(this.props)
            .filter(([key, value]) =>
                key.indexOf('on') !== 0 &&
                !Props.ExcludedProps[key]
            );
        return (
            <div className="h-box object-properties">
                {!this.props.hasOwnProperty('id') ? [] : [
                    <input type="checkbox"
                        key="active"
                        data-prop="active"
                        data-value="checked"
                        checked={this.props.active}
                        onChange={this.handlePropertyChange}
                        onClick={this.handlePropertyClick}
                    />,
                    <span key="name">
                        [{this.props.kind === 'block' ? this.props.blockTypeName : 'wire'}]
                    </span>,
                ]}
                {filteredProps.map(([key, value]) =>
                    <div key={key}>
                        <span>{mangle(key)}:</span>
                        <input data-prop={key}
                            value={value}
                            onChange={this.handlePropertyChange}
                            onClick={this.handlePropertyClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}