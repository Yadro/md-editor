///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage, Note} from "./Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";


class App extends React.Component<any, any> {
    
    constructor(props) {
        super(props);
        this.state = {
            currentNote: null,
            noteInstance: new Note()
        };
        this.onSetNote = this.onSetNote.bind(this);
        this.onInputEditor = this.onInputEditor.bind(this);
        this.newNote = this.newNote.bind(this);

        // storage.add({text: 'text', title: 'lool'});
        // storage.exportStorage();
        storage.addEventListener('remove', () => {
            this.forceUpdate();
        });
        storage.addEventListener('add', () => {
            this.forceUpdate();
        });
    }

    onSetNote(e) {
        console.log(e);
    }

    newNote(title) {
        this.setState({
            noteInstance: new Note(title)
        })
    }

    onInputEditor(e: string) {
        const note = this.state.noteInstance;
        note.setText(e);
        this.setState({
            noteInstance: note
        });
    }
    
    render() {
        const noteInstance = this.state.noteInstance;
        return (
            <div>
                <h2>Simple Editor</h2>
                <NoteList 
                    onSetNote={this.onSetNote}
                    onNewNote={this.newNote}
                />
                <SimpleMDEWrap value={noteInstance.text} onChange={this.onInputEditor}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector('.react'));