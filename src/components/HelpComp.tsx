import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";

export default class HelpComp extends React.Component<SimpleRouterInjProps, any> {

    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div>
                <button onClick={() => this.props.go('Settings', {})}>{'<-'}</button>
                <h2>This is help</h2>
                <div>
                    Sample text
                </div>
            </div>
        )
    }
}