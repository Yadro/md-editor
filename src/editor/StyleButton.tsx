import * as React from 'react';

interface StyleButtonP {
    style;
    active;
    label;
    onToggle: Function;
}

export default class StyleButton extends React.Component<StyleButtonP, any> {
    onToggle;

    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}