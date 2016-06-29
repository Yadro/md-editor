///<reference path="../typings/index.d.ts"/>

import './App.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage, Note, INoteItem} from "./helper/Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";
import TagInput from "./components/TagInput";
import Welcome from "./components/Welcome";


interface AppS {
    menu?: boolean;
    privateMode?: boolean;
    notes?: (Note | INoteItem)[];
    currentNote?: boolean;
    noteInstance?: Note;
}

class App extends React.Component<any, AppS> {
    timerId;

    constructor(props) {
        super(props);
        this.state = {
            menu: true,
            privateMode: false, 
            notes: [],
            currentNote: null,
            noteInstance: new Note()
        };
        [
            'onSetNote',
            'onInputEditor',
            'newNote',
            'onChangeTags',
            'onEnter',
        ].forEach(fn => this[fn] = this[fn].bind(this));

        // storage.add({text: 'text', title: 'lool'});
        // storage.exportStorage();
        storage.addEventListener('update', () => {
            this.setState({notes: storage.getAll(this.state.privateMode)});
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
        console.log('select note id:'+note.id);

        if (noteInstance) {
            console.log('save in storage:'+note.id);
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

        /**
         * установка таймера на сохранение заметки
         * todo переместить логику в storage.setById
         */
        if (this.timerId) {
            window.clearInterval(this.timerId);
        }
        this.timerId = window.setTimeout((e) => {
            storage.setById(note.id, note);
            storage.exportStorage();
        }, 1500);
    }
    
    onEnter(st) {
        const privateMode = st === 2;
        this.setState({
            menu: false,
            privateMode,
            notes: storage.getAll(privateMode)
        });
        if (privateMode) {
            document.querySelector('body').className = 'private';
        }
    }
    
    render() {
        const {noteInstance, privateMode, notes} = this.state;
        if (this.state.menu) {
            return <Welcome callback={this.onEnter}/>
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