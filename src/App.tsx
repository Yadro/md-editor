///<reference path="../typings/index.d.ts"/>

import './App.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import SimpleMDEWrap from "./components/SimpleMDEWrap";
import TagInput from "./components/TagInput";
import Welcome from "./components/Welcome";
import Settings from "./components/Settings";
import {SimpleRouter, SimpleRouterInjProps} from "./lib/SimpleRouter";
import {storage, Note, INoteItem, Hash} from "./helper/Storage";
import {consoleWarn} from "./helper/Tools";
import {config} from "./Config";


interface AppS {
    privateMode?: boolean;
    notes?: (Note)[];
    currentNote?: Hash;
    noteInstance?: (Note);
    noteModificated?: boolean;
}

class App extends React.Component<SimpleRouterInjProps, AppS> {
    timerId;

    constructor(props) {
        super(props);
        let privateMode = false;
        this.state = {
            privateMode: privateMode,
            notes: storage.getAll(privateMode),
            currentNote: null,
            noteInstance: new Note(),
            noteModificated: false
        };
        [
            'openNote',
            'onInputEditor',
            'newNote',
            'saveNote',
            'onChangeTags',
            'onEnter',
            'onStorageUpdate',
            'onStorageRemove',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    componentDidMount() {
        storage.addEventListener('update', this.onStorageUpdate);
        storage.addEventListener('remove', this.onStorageRemove);
    }

    componentWillUnmount() {
        storage.removeEventListener('update', this.onStorageUpdate);
        storage.removeEventListener('remove', this.onStorageRemove);
        window.clearInterval(this.timerId);
        this.saveNote();
        storage.exportStorage();
    }

    onStorageRemove() {
        const notes = storage.getAll(this.state.privateMode);
        const current = notes[0] || new Note();
        this.setState({
            notes: notes,
            currentNote: current.id,
            noteInstance: current
        });
    }

    onStorageUpdate() {
        this.setState({notes: storage.getAll(this.state.privateMode)});
    }

    /**
     * Переключаемся на др заметку
     * обновляем id и заметку
     * сохраняем старую
     * @param id
     */
    openNote(id) {
        if (this.state.currentNote === id) {
            return;
        }
        const note = storage.getById(id);
        console.log('select note id:'+note.id);

        this.saveNote();

        this.setState({
            currentNote: id,
            noteInstance: note,
            noteModificated: false
        })
    }

    saveNote() {
        const {noteInstance, noteModificated} = this.state;
        if (noteInstance && noteModificated) {
            storage.setByIdSaveDate(noteInstance.id, noteInstance);
        }
    }

    onChangeTags(tags) {
        const {noteInstance} = this.state;
        noteInstance.setTag(tags);

        storage.setById(noteInstance.id, noteInstance);
        storage.exportStorage();

        this.setState({
            noteInstance,
            noteModificated: true
        })
    }


    /**
     * Создаем новую заметку
     * @param title
     */
    newNote(title) {
        const note = storage.add(new Note(title, 'text'));
        this.setState({
            currentNote: note.id,
            noteInstance: note,
            noteModificated: true
        })
    }

    onInputEditor(e: string) {
        const note = this.state.noteInstance;
        note.setText(e);
        this.setState({
            noteInstance: note,
            noteModificated: true
        });

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
        const {noteInstance, privateMode, notes, currentNote} = this.state;
        return (
            <div className={privateMode ? 'grey-bg' : ''}>
                <NoteList
                    notes={notes}
                    currentNote={currentNote}
                    onSetNote={this.openNote}
                    onNewNote={this.newNote}
                />
                <TagInput tags={noteInstance.tags} onChangeTags={this.onChangeTags}/>
                <SimpleMDEWrap 
                    value={noteInstance.text}
                    onChange={this.onInputEditor}
                    currentNote={currentNote}
                />
                <button onClick={this.props.go.bind(this, 'Settings', {})}>settings</button>
            </div>
        )
    }
}

const routers = {
    index: Welcome,
    Welcome: Welcome,
    App: App,
    Settings: Settings
};

ReactDOM.render(<SimpleRouter routers={routers} />, document.querySelector('.react'));