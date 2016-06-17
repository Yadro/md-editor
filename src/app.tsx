///<reference path="../typings/index.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Comp from './components/compoent';
import * as SimpleMDE from '../node_modules/simplemde/dist/simplemde.min.js';

class App extends React.Component<any, any> {

    render() {
        return (
            <div>
                <h2>Hello</h2>
                <Comp />
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