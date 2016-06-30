import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";

interface SelectNotesP extends SimpleRouterInjProps {
    callback: Function;
}

export default class Welcome extends React.Component<SelectNotesP, any> {
    constructor(props) {
        super(props);
        this.state = {
            pswd: 0,
            text: ''
        };
        console.log(this.props);
    }

    onClick() {
        if (this.state.text === '7788') {
            this.props.go('App', {password: this.state.text});
        } else {
            this.props.go('App');
        }
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