import React from 'react';

export default class extends React.Component {
    handleClick = (e) => {
        if (this.props.enabled !== false && this.props.onClick) {
            this.props.onClick(e);
        }
    }
    render() {
        return (
            <i
                className={`button ${this.props.className} ${this.props.enabled === false ? 'disabled' : ''}`}
                aria-hidden="true"
                onClick={this.handleClick}>
            </i>
        );
    }
}