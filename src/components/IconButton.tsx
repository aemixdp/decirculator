import React from 'react';

type EventListeners = {
    onClick: React.MouseEventHandler<any>;
};

type Props = EventListeners & {
    enabled: boolean;
    className: string;
};

export class IconButton extends React.Component<Props, any> {
    static defaultProps: EventListeners = {
        onClick: () => { },
    };
    handleClick = (e: React.MouseEvent<any>) => {
        if (this.props.enabled !== false) {
            this.props.onClick(e);
        }
    }
    render() {
        return (
            <i
                className={`button ${this.props.className} ${this.props.enabled === false ? 'disabled' : ''}`}
                aria-hidden="true"
                onClick={this.handleClick}
            />
        );
    }
}
