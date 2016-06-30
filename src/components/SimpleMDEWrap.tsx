///<reference path="../../typings/index.d.ts"/>
import './SimpleMDEWrap.css';
//noinspection TypeScriptCheckImport
import * as SimpleMDE from 'simplemde';
import * as React from 'react';

interface SimpleMDEWrapP {
    value;
    currentNote;
    onChange: (text: string) => any;
}

export class SimpleMDEWrap extends React.Component<SimpleMDEWrapP, any> {
    simplemde;
    getChanges = false;
    currentNote;

    constructor(props) {
        super(props);
        this.currentNote = this.props.currentNote;
    }

    componentDidMount() {
        console.log('SimpleMDEWrap: componentDidMount');
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false,
            autoDownloadFontAwesome: false,
            toolbar: ["bold", "italic", "heading", "|", "quote", 'link', 'image', 'table', '|', 'code',
            '|', 'preview', 'side-by-side'],
        });
        // this.simplemde.codemirror.setOption('viewportMargin', Infinity);

        this.simplemde.codemirror.setValue(this.props.value);
        this.simplemde.codemirror.on("change", () => {
            if (this.getChanges) {
                this.getChanges = false
            } else {
                this.props.onChange(this.simplemde.value());
            }
        });
    }

    componentWillUnmount() {
        console.log('SimpleMDEWrap: componentWillUnmount')
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('SimpleMDEWrap: shouldComponentUpdate');
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentNote === this.currentNote) {
            return;
        }
        this.currentNote = nextProps.currentNote;
        this.getChanges = true;
        this.simplemde.codemirror.setValue(nextProps.value);
    }

    render() {
        console.log('render');
        return (
            <textarea id="editor"/>
        )
    }
}


