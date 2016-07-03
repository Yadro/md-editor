///<reference path="../../typings/index.d.ts"/>
import '../../style/editor/RichEditor.css';
import '../../style/editor/Editor.css';
import * as React from 'react';
import {
    Editor,
    EditorState,
    ContentState,
    RichUtils,
    convertFromRaw,
    convertToRaw,
    CompositeDecorator
} from 'draft-js';
//noinspection TypeScriptCheckImport
import {stateToMarkdown} from 'draft-js-export-markdown';
//noinspection TypeScriptCheckImport
import {stateFromMarkdown} from 'draft-js-import-markdown';
import {BlockStyleControls} from "./BlockStyleControls";
import {InlineStyleControls} from "./InlineStyleControls";
import {
    hashtagStrategy, HashtagSpan, noteLinkStrategy, NoteLinkSpanBind,
    findLinkEntities, LinkSpan
} from "./DecorationComponents";

interface WrapEditoP {
    value;
    currentNote;
    onChange: (text: string) => any;
    selectNote: Function;
}

interface WrapEditorS {
    editorState: EditorState
}


export default class WrapEditor extends React.Component<WrapEditoP, WrapEditorS> {
    focus;
    currentNote;
    compositeDecorator;
    timer;
    
    constructor(props) {
        super(props);

        this.currentNote = this.props.currentNote;
        this.compositeDecorator = new CompositeDecorator([
            {
                strategy: hashtagStrategy,
                component: HashtagSpan,
            }, {
                strategy: noteLinkStrategy,
                component: NoteLinkSpanBind(props.selectNote), // todo нужна ли функция selectNote?
            }, {
                strategy: findLinkEntities,
                component: LinkSpan
            }
        ]);
        
        this.state = {
            editorState: EditorState.createWithContent(
                stateFromMarkdown('_Welcome._ Have a ++nice++ day!'),
                this.compositeDecorator
            ),
        };
        
        [
            'onChange',
            'handleKeyCommand',
            'toggleBlockType',
            'toggleInlineStyle',
            'logRawContext',
            'exportLog',
        ].forEach(fn => this[fn] = this[fn].bind(this));
        this.focus = () => this.refs.editor.focus();
    }


    componentWillUnmount() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }

    componentWillReceiveProps(nextProps) {
        // https://facebook.github.io/draft-js/docs/advanced-topics-decorators.html#setting-new-decorators
        if (nextProps.currentNote === this.currentNote) {
            return;
        }
        this.currentNote = nextProps.currentNote;
        this.setState({
            editorState: EditorState.createWithContent(
                stateFromMarkdown(nextProps.value),
                this.compositeDecorator
            )
        });
    }
    
    onChange(editorState: EditorState) {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(() => {
            this.props.onChange(
                stateToMarkdown(editorState.getCurrentContent())
            )
        }, 1500);
        this.setState({editorState});
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

    logRawContext() {
        const editorState = this.state.editorState;
        const context = editorState.getCurrentContent();
        const raw = convertToRaw(context);
        console.log(raw);
    }

    exportLog() {
        const editorState = this.state.editorState;
        console.log(stateToMarkdown(editorState.getCurrentContent()));
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
                <span className="RichEditor-styleButton" onClick={this.logRawContext}>log</span>
                <span className="RichEditor-styleButton" onClick={this.exportLog}>export</span>
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




