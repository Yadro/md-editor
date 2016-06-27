import * as React from 'react';

interface SelectNotesP {
    callback: Function;
}

export default class Welcome extends React.Component<SelectNotesP, any> {
    constructor(props) {
        super(props);
        this.state = {
            pswd: 0,
            text: ''
        }
    }

    onClick() {
        if (this.state.text === '7788') {
            this.props.callback(2);
            return;
        }
        this.props.callback(1);
    }

    render() {
        return (
            <div>
                <button onClick={this.onClick.bind(this)}>continue</button>
                <button onClick={() => this.setState({pswd: 1})}>more</button>
                {this.state.pswd ?
                    <span>
                        <input type="text"
                               value={this.state.text}
                               onChange={(e) => this.setState({text: e.target.value})}/>
                        <button onClick={this.onClick.bind(this)}>ok</button>
                    </span>
                : null}
            </div>
        )
    }
    
}