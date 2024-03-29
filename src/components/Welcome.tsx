import '../../style/components/Welcome.css';

import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";
import {config} from "../Config";
import {consoleWarn} from "../helper/Tools";

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
            <div className="Welcome">
                <div className="welcome-wrapper">
                    <h1>Welcome</h1>
                    <div className="welcome-container">
                        <button onClick={this.onClick.bind(this)}>continue</button>
                        <button onClick={() => this.setState({pswd: 1})}>more</button>
                    </div>

                    {this.state.pswd ?
                        <span>
                        <input type="text"
                               value={this.state.text}
                               onChange={(e) => this.setState({text: e.target.value})}/>
                        <button onClick={this.onClick.bind(this)}>ok</button>
                    </span>
                        : null}
                </div>
            </div>
        )
    }
    
}