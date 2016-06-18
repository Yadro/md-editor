///<reference path="../../typings/index.d.ts"/>
//noinspection TypeScriptCheckImport
import * as SimpleMDE from 'simplemde';
import * as React from 'react';

interface SimpleMDEWrapP {
    value;
    onChange: (text: string) => any;
}

export class SimpleMDEWrap extends React.Component<SimpleMDEWrapP, any> {
    simplemde;

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || 'hello'
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false,
            autoDownloadFontAwesome: false
        });
        this.simplemde.codemirror.setValue(this.state.value);

        this.simplemde.codemirror.on("change", () => {
            this.setState({
                value: this.simplemde.value()
            });
            this.props.onChange(this.simplemde.value());
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        this.simplemde.codemirror.setValue(nextProps.value);
    }
    
    render() {
        console.log('render');
        return (
            <textarea id="editor">loading...</textarea>
        )
    }
}


