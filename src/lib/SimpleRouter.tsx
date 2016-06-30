import * as React from 'react';
import {config} from "../Config";

interface SimpleRouterP {
    routers?: Object;
}

interface SimpleRouterS {
    routers?: Object;
    current?;
    sendProps?: Object;
}

export interface SimpleRouterInjProps {
    go: (router: string, params?: Object) => any;
}

export class SimpleRouter extends React.Component<SimpleRouterP, SimpleRouterS> {

    constructor(props) {
        super(props);
        this.state = {
            routers: props.routers,
            current: props.routers.index,
            sendProps: {}
        };
        [
            '_go',
            'injectGo'
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    componentWillMount() {
        console.warn('SimpleRouter: componentWillMount');
    }

    componentWillReceiveProps(nextProps) {
        console.warn('SimpleRouter: componentWillReceiveProps');
    }

    _go(router: string, params?: Object) {
        let reactClass;
        const _routers = this.state.routers;
        for (var _router in _routers) {
            if (_routers.hasOwnProperty(_router)
                && _router === router) {
                reactClass = _routers[_router];
                break;
            }
        }
        if (reactClass) {
            this.setState({
                current: reactClass,
                sendProps: params || {}
            })
        } else {
            console.error(`SimpleRouter: Router '${router}' not found`)
        }
    }

    injectGo(props) {
        props = props || {};
        props['go'] = this._go;
        return props;
    }


    render() {
        console.warn('SimpleRouter: render');
        const _state = this.state;
        const component = _state.current;
        const props = this.injectGo(_state.sendProps);
        
        if (config.debug.router) {
            console.info(`Router '${component.name}' with props:`, props);
        }
        return (
            React.createElement(component, props)
        )
    }
}
