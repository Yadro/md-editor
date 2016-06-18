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
    getChanges = false;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false,
            autoDownloadFontAwesome: false
        });
        this.simplemde.codemirror.setValue(this.props.value);

        this.simplemde.codemirror.on("change", () => {
            if (this.getChanges) {
                this.getChanges = false
            } else {
                this.props.onChange(this.simplemde.value());
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        this.getChanges = true;
        this.simplemde.codemirror.setValue(nextProps.value);
    }
    
    render() {
        console.log('render');
        return (
            <textarea id="editor">loading...</textarea>
        )
    }
}


