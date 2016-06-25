///<reference path="../typings/index.d.ts"/>

import '../content/style.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage, Note} from "./Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";
import TagInput from "./components/TagInput";
import SelectNotes from "./components/SelectNotes";

class App extends React.Component<any, any> {
    timerId;

    constructor(props) {
        super(props);
        this.state = {
            menu: true,
            privateMode: false, 
            notes: storage.getAll(),
            currentNote: null,
            noteInstance: new Note()
        };
        this.onSetNote = this.onSetNote.bind(this);
        this.onInputEditor = this.onInputEditor.bind(this);
        this.newNote = this.newNote.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);

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
        console.log('select ', note);

        if (noteInstance) {
            storage.setById(noteInstance.id, noteInstance);
        }

        this.setState({
            currentNote: id,
            noteInstance: note
        })
    }

    onChangeTags(tags) {
        const {noteInstance} = this.state;
        noteInstance.setTag(tags);

        storage.setById(noteInstance.id, noteInstance);
        storage.exportStorage();

        this.setState({
            noteInstance
        })
    }


    newNote(title) {
        const note = storage.add(new Note(title, 'text'));
        console.log(note);
        this.setState({
            currentNote: note.id,
            noteInstance: note,
        })
    }

    onInputEditor(e: string) {
        const note = this.state.noteInstance;
        note.setText(e);
        this.setState({
            noteInstance: note
        });

        if (this.timerId) {
            window.clearInterval(this.timerId);
        }
        this.timerId = window.setTimeout((e) => {
            storage.setById(note.id, note);
            storage.exportStorage();
        }, 1500);
    }
    
    render() {
        const {noteInstance, privateMode, notes} = this.state;
        if (this.state.menu) {
            return <SelectNotes callback={(st) => this.setState({menu: false, privateMode: st === 2})}/>
        }
        return (
            <div className={privateMode ? 'grey-bg' : ''}>
                <NoteList
                    notes={notes}
                    onSetNote={this.onSetNote}
                    onNewNote={this.newNote}
                />
                <TagInput tags={noteInstance.tags} onChangeTags={this.onChangeTags}/>
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