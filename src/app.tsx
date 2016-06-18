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
        this.onSelect = this.onSelect.bind(this);
        this.onInputEditor = this.onInputEditor.bind(this);

        // storage.add({text: 'text', title: 'lool'});
        // storage.exportStorage();
        storage.addEventListener('remove', () => {
            this.forceUpdate();
        });
        storage.addEventListener('add', () => {
            this.forceUpdate();
        });
    }

    onSelect(e) {
        console.log(e);
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
                <NoteList callback={this.onSelect}/>
                <SimpleMDEWrap value={noteInstance.text} onChange={this.onInputEditor}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector('.react'));