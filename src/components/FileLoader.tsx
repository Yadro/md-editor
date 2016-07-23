import * as React from 'react';
import {storage} from "../helper/Storage";
import ChromeFileLoader from "../helper/ChromeFileLoader";

export default class FileLoader extends React.Component<any, any> {

    savedFileEntry;

    constructor(props) {
        super(props);
        [
            'onUploadFile',
            'onDownloadFile',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    onUploadFile() {
        let chromeFileLoader = new ChromeFileLoader();
        chromeFileLoader.loadFile();
    }

    onDownloadFile() {
        let chromeFileLoader = new ChromeFileLoader();
        chromeFileLoader.saveFile('todos.json', {saveData: 'this is data'});
    }

    render() {
        return (
            <div>
                <h1>File upload</h1>
                <button onClick={this.onUploadFile}>Upload notes</button>
                <button onClick={this.onDownloadFile}>Download notes</button>
            </div>
        )
    }
}
