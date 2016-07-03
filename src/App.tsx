///<reference path="../typings/index.d.ts"/>

import '../style/App.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from "moment";
import NoteList from './components/NoteList';
import SimpleMDEWrap from "./components/SimpleMDEWrap";
import TagInput from "./components/TagInput";
import Welcome from "./components/Welcome";
import Settings from "./components/Settings";
import {SimpleRouter, SimpleRouterInjProps} from "./lib/SimpleRouter";
import {storage, Note, INoteItem, Hash} from "./helper/Storage";
import {consoleWarn} from "./helper/Tools";
import {config} from "./Config";
import WrapEditor from "./editor/Editor";


interface AppS {
    privateMode?: boolean;
    notes?: (Note)[];
    currentNote?: Hash;
    noteInstance?: (Note);
    noteModificated?: boolean;
}

class App extends React.Component<SimpleRouterInjProps, AppS> {

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
            'newNote',
            'openNote',
            'saveNote',
            'selectNote',
            'onInputEditor',
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
        this.saveNote();

        const note = storage.getById(id);
        console.log('select note id:'+note.id);

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

    /**
     * Сохранение введенного текста в state
     * добавление таймера для сохранения заметки в storage
     * @param e
     */
    onInputEditor(e: string) {
        console.log('onInputEditor', e);

        const note = this.state.noteInstance;
        note.setText(e);
        this.setState({
            noteInstance: note,
            noteModificated: true
        });

        storage.setById(note.id, note);
        storage.exportStorage();
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

    selectNote(noteId: Hash) {
        console.warn('select note id:', noteId);
        // todo this.openNote
    }
    
    render() {
        const state = this.state;
        const currentNote = state.currentNote;
        const noteInstance = state.noteInstance;
        return (
            <div className={state.privateMode ? 'grey-bg' : ''}>
                <NoteList
                    notes={state.notes}
                    currentNote={currentNote}
                    onSetNote={this.openNote}
                    onNewNote={this.newNote}
                />
                <TagInput tags={noteInstance.tags} onChangeTags={this.onChangeTags}/>
                <WrapEditor
                    value={noteInstance.text}
                    onChange={this.onInputEditor}
                    currentNote={currentNote}
                    selectNote={this.selectNote}
                />
                <button onClick={this.props.go.bind(this, 'Settings', {})}>settings</button>
                <span>Create: {moment(noteInstance.createTime).format('DD.MM HH:mm:ss')} </span>
                <span>Last edit: {moment(noteInstance.editTime).format('DD.MM HH:mm:ss')}</span>
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