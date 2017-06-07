import React from 'react';

export default class extends React.Component {
    render() {
        return (
            <div className={`p-rel dropdown ${this.props.className}`}>
                <select
                    defaultValue=""
                    spellCheck={this.props.spellCheck}
                    onChange={this.props.onValueSelect}
                >
                    <option disabled value="">Select item...</option>
                    {this.props.variants.map(v =>
                        <option key={v} value={v}>{v}</option>
                    )}
                </select>
                <input
                    value={this.props.value}
                    spellCheck={this.props.spellCheck}
                    onChange={this.props.onTextChange}
                />
            </div>
        );
    }
}
