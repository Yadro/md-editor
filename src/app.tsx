///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import * as SimpleMDE from 'simplemde';


class App extends React.Component<any, any> {
    
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(e) {
        console.log(e);
    }
    
    render() {
        return (
            <div>
                <h2>Simple Editor</h2>
                <NoteList callback={this.onSelect}/>
            </div>
        )
    }
}

new SimpleMDE({
    element: document.getElementById("editor"),
    spellChecker: false,
    autoDownloadFontAwesome: false
});

ReactDOM.render(<App/>, document.querySelector('.react'));