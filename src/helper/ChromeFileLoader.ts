
export default class ChromeFileLoader {

    data;

    loadFile() {
        chrome.fileSystem.chooseEntry({type: 'openFile'}, (readOnlyEntry) => {
            readOnlyEntry.file((file) => {
                var reader = new FileReader();
                reader.onerror = this.onError;
                reader.onloadend = e => {
                    console.log(e.target.result);
                    console.log(JSON.parse(e.target.result));
                };
                reader.readAsText(file);
            });
        });
    }

    saveFile(fileName: string, data) {
        this.data = data;
        chrome.fileSystem.chooseEntry( {
            type: 'saveFile',
            suggestedName: fileName,
        }, this.writeFile.bind(this));
    }

    writeFile(writableFileEntry) {
        console.log(writableFileEntry);
        writableFileEntry.createWriter((writer) => {
            writer.onerror = this.onError;
            writer.onwriteend = e => console.log('write complete');

            const data = JSON.stringify(this.data);
            console.log(this.data);
            writer.write(new Blob([data], {
                type: "application/json;charset=utf-8"
            }));
        }, this.onError);
    }

    onError(e) {
        console.error(e);
    }
}