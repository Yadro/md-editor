import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";

interface SelectNotesP extends SimpleRouterInjProps {
    callback: Function;
}

export default class Settings extends React.Component<SelectNotesP, any> {

    constructor(props) {
        super(props);
        this.state = {
            date: null
        };
        [
            'onClickSetState',
            'onGoBack',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    componentDidMount() {
        console.log('Settings: componentDidMount', this.state);
    }

    componentWillUnmount() {
        console.log('Settings: componentWillUnmount', this.state);
    }

    componentWillReceiveProps(nextProps) {
        console.warn('Settings: componentWillReceiveProps');
    }

    onClickSetState() {
        this.setState({
            date: new Date()
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
                    <button onClick={this.onClickSetState}>setState</button>
                    <button onClick={this.onGoBack}>back</button>
                </div>
            </div>
        )
    }
}