///<reference path="../typings/index.d.ts"/>

import './App.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage, Note, INoteItem} from "./helper/Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";
import TagInput from "./components/TagInput";
import Welcome from "./components/Welcome";
import {SimpleRouter} from "./lib/SimpleRouter";


interface AppS {
    menu?: boolean;
    privateMode?: boolean;
    notes?: (Note | INoteItem)[];
    currentNote?: boolean;
    noteInstance?: Note;
    noteModificated?: boolean;
}

class App extends React.Component<any, AppS> {
    timerId;

    constructor(props) {
        super(props);
        this.state = {
            menu: false,
            privateMode: false, 
            notes: [],
            currentNote: null,
            noteInstance: new Note(),
            noteModificated: false
        };
        [
            'onSetNote',
            'onInputEditor',
            'newNote',
            'onChangeTags',
            'onEnter',
        ].forEach(fn => this[fn] = this[fn].bind(this));
        
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
        const {currentNote, noteInstance, noteModificated} = this.state;
        if (currentNote === id) {
            return;
        }
        const note = storage.getById(id);
        console.log('select note id:'+note.id);

        if (noteInstance && noteModificated) {
            console.log('save in storage:'+note.id);
            storage.setById(noteInstance.id, noteInstance);
        }

        this.setState({
            currentNote: id,
            noteInstance: note,
            noteModificated: false
        })
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
        console.log(note);
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
        if (this.state.menu) {
            return <Welcome callback={this.onEnter}/>
        }
        return (
            <div className={privateMode ? 'grey-bg' : ''}>
                <NoteList
                    notes={notes}
                    currentNote={currentNote}
                    onSetNote={this.onSetNote}
                    onNewNote={this.newNote}
                />
                <TagInput tags={noteInstance.tags} onChangeTags={this.onChangeTags}/>
                <SimpleMDEWrap 
                    value={noteInstance.text}
                    onChange={this.onInputEditor}
                    currentNote={currentNote}
                />
            </div>
        )
    }
}

class Main extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    go() {
        this.props.go('greater', {sendParams: 'sendParams'});
    }
    
    render() {
        return (
            <div>
                <div>Hello</div>
                <span>{this.props.greater}</span>
                <button onClick={this.go.bind(this)}>go to</button>
            </div>
        )
    }
}

class Greater extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    go() {
        this.props.go('home', {greater: 'greater'});
    }

    render() {
        return (
            <div>
                <div>Grater</div>
                <span>{this.props.sendParams}</span>
                <button onClick={this.go.bind(this)}>go back</button>
            </div>
        )
    }
}

const routers = {
    index: Main,
    home: Main,
    greater: Greater
};

ReactDOM.render(<SimpleRouter routers={routers} debug/>, document.querySelector('.react'));