///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoteList from './components/NoteList';
import * as SimpleMDE from 'simplemde';


class App extends React.Component<any, any> {

    render() {
        return (
            <div>
                <h2>Hello</h2>
                <NoteList />
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