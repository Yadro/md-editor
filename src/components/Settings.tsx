import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";
import {consoleWarn} from "../helper/Tools";
import {config} from "../Config";

interface SelectNotesP extends SimpleRouterInjProps {
    callback: Function;
}

export default class Settings extends React.Component<SelectNotesP, any> {

    constructor(props) {
        super(props);
        this.state = {
            checkbox: false
        };
        [
            'onClickCheckbox',
            'onGoBack',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    onClickCheckbox() {
        this.setState({
            checkbox: !this.state.checkbox
        })
    }

    onGoBack() {
        this.props.go('App', {});
    }

    render() {
        return (
            <div>
                <h2>settings</h2>
                <div>
                    <input type="checkbox" onChange={this.onClickCheckbox} value={this.state.checkbox}/>
                    <button onClick={this.onGoBack}>back</button>
                </div>
            </div>
        )
    }
}