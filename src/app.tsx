///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import {storage} from "./Storage";
import {SimpleMDEWrap} from "./components/SimpleMDEWrap";


class App extends React.Component<any, any> {
    
    constructor(props) {
        super(props);
        this.state = {};
        this.onSelect = this.onSelect.bind(this);

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
    
    render() {
        return (
            <div>
                <h2>Simple Editor</h2>
                <NoteList callback={this.onSelect}/>
                <SimpleMDEWrap />
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector('.react'));