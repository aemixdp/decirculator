import React from 'react';

const mangle = (str) => {
    const lc = str.match(/[a-z]+/g);
    const uc = str.match(/[A-Z]+/g);
    const result = [lc[0]];
    for (let i = 1; i < lc.length; ++i) {
        result.push(uc[i - 1].toLowerCase() + lc[i]);
    }
    return result.join('-');
}

export default class Props extends React.Component {
    static defaultProps = {
        onPropertyChange: () => { },
    }
    static ExcludedProps = {
        id: true,
        kind: true,
        blockType: true,
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
    }
    handlePropertyChange = (e) => {
        this.props.onPropertyChange(e,
            this.props,
            e.target.dataset.prop,
            e.target[e.target.dataset.value || 'value']
        );
    }
    render() {
        const filteredProps = Object.entries(this.props)
            .filter(([key, value]) =>
                key.indexOf('on') !== 0 &&
                !Props.ExcludedProps[key]
            );
        return (
            <div className="hbox object-properties">
                <input type="checkbox"
                    data-prop="active"
                    data-value="checked"
                    checked={this.props.active}
                    onChange={this.handlePropertyChange}
                />
                <span>
                    {this.props.kind === 'block' ? this.props.blockType.name : 'wire'}
                </span>
                {filteredProps.map(([key, value]) =>
                    <div key={key}>
                        <span>{mangle(key)}:</span>
                        <input data-prop={key}
                            value={value}
                            onChange={this.handlePropertyChange}
                        />
                    </div>
                )}
            </div>
        );
    }
}