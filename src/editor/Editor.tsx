///<reference path="../../typings/index.d.ts"/>
import '../../style/editor/RichEditor.css';
import * as React from 'react';
import {
    Editor,
    EditorState,
    RichUtils,
} from 'draft-js';
import {BlockStyleControls} from "./BlockStyleControls";
import {InlineStyleControls} from "./InlineStyleControls";

interface WrapEditoP {
    value;
    currentNote;
    onChange: (text: string) => any;
}

interface WrapEditorS {
    editorState: EditorState
}


export default class WrapEditor extends React.Component<WrapEditoP, WrapEditorS> {
    focus;
    onChange;
    handleKeyCommand;
    toggleBlockType;
    toggleInlineStyle;
    
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
        };

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this.setState({editorState});

        [
            'handleKeyCommand',
            'toggleBlockType',
            'toggleInlineStyle',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    render() {
        const {editorState} = this.state;

        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="RichEditor-root">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <div className={className} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        placeholder="Tell a story..."
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
            </div>
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}



