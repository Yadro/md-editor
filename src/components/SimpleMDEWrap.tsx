///<reference path="../../typings/index.d.ts"/>
//noinspection TypeScriptCheckImport
import * as SimpleMDE from 'simplemde';
import * as React from 'react';

interface SimpleMDEWrapP {
    value;
    onChange: (text: string) => any;
}

export class SimpleMDEWrap extends React.Component<SimpleMDEWrapP, any> {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || 'hello'
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        let simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false,
            autoDownloadFontAwesome: false
        });
        simplemde.codemirror.setValue(this.state.value);
        
        simplemde.codemirror.on("change", () => {
            this.setState({
                value: simplemde.value()
            });
            this.props.onChange(simplemde.value());
        });
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    
    render() {
        console.log('render');
        return (
            <textarea id="editor">loading...</textarea>
        )
    }
}


