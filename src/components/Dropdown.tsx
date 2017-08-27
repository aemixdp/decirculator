import React from 'react';

type Props = {
    value: string;
    variants: string[];
    spellCheck: boolean;
    className: string;
    onValueSelect?: React.ChangeEventHandler<any>;
    onTextChange?: React.ChangeEventHandler<any>;
};

export class Dropdown extends React.Component<Props, any> {
    render() {
        return (
            <div className={`p-rel dropdown ${this.props.className}`}>
                <select
                    defaultValue=""
                    spellCheck={this.props.spellCheck}
                    onChange={this.props.onValueSelect}
                >
                    <option disabled={true} value="">Select item...</option>
                    {this.props.variants.map(v =>
                        <option key={v} value={v}>{v}</option>
                    )}
                </select>
                <input
                    value={this.props.value}
                    spellCheck={this.props.spellCheck}
                    onChange={this.props.onTextChange}
                    readOnly={!this.props.onTextChange}
                />
            </div>
        );
    }
}
