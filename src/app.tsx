///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage, Note} from "./Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";

storage.add(new Note('note1', 'text1'));
storage.add(new Note('note2', 'text2'));
storage.add(new Note('note3', 'text3'));
storage.add(new Note('note4', 'text4'));
storage.add(new Note('note5', 'text5'));

class App extends React.Component<any, any> {
    
    constructor(props) {
        super(props);
        this.state = {
            notes: storage.getAll(),
            currentNote: null,
            noteInstance: new Note()
        };
        this.onSetNote = this.onSetNote.bind(this);
        this.onInputEditor = this.onInputEditor.bind(this);
        this.newNote = this.newNote.bind(this);

        // storage.add({text: 'text', title: 'lool'});
        // storage.exportStorage();
        storage.addEventListener('remove', () => {
            this.setState({notes: storage.getAll()});
        });
        storage.addEventListener('add', () => {
            this.setState({notes: storage.getAll()});
        });
        storage.addEventListener('update', () => {
            this.setState({notes: storage.getAll()});
        });
    }

    /**
     * Переключаемся на др заметку
     * обновляем id и заметку
     * сохраняем старую
     * @param id
     */
    onSetNote(id) {
        const {noteInstance} = this.state;
        const note = storage.getById(id);
        console.log(note);

        if (noteInstance) {
            noteInstance.setTitle(noteInstance.title + ' up');
            storage.setById(noteInstance.id, noteInstance);
        }

        this.setState({
            currentNote: id,
            noteInstance: note
        })
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
                    notes={this.state.notes}
                    onSetNote={this.onSetNote}
                    onNewNote={this.newNote}
                />
                <SimpleMDEWrap 
                    value={noteInstance.text}
                    onChange={this.onInputEditor}
                    currentNote={this.state.currentNote}
                />
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector('.react'));