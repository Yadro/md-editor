///<reference path="../../typings/index.d.ts"/>
import '../../style/components/SimpleMDEWrap.css';
//noinspection TypeScriptCheckImport
import * as SimpleMDE from 'simplemde';
import * as React from 'react';
import {config} from "../Config";
import {consoleWarn} from "../helper/Tools";

interface SimpleMDEWrapP {
    value;
    currentNote;
    onChange: (text: string) => any;
}

export default class SimpleMDEWrap extends React.Component<SimpleMDEWrapP, any> {
    simplemde;
    getChanges = false;
    currentNote;

    constructor(props) {
        super(props);
        this.currentNote = this.props.currentNote;
    }

    componentDidMount() {
        if (config.debug.unmount) {
            consoleWarn(this, 'componentDidMount');
        }

        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false,
            autoDownloadFontAwesome: false,
            toolbar: [
                "bold", "italic", "heading",
                "|", "quote", 'unordered-list', 'ordered-list',
                '|', 'link', 'image', 'table',
                '|', 'code',
                '|', 'preview',
            ],
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
        if (config.debug.unmount) {
            consoleWarn(this, 'componentWillUnmount')
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
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
        return (
            <textarea id="editor"/>
        )
    }
}


