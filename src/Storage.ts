//noinspection TypeScriptCheckImport
import {EventDispatcher} from './lib/EventDispatcher'

const nameStorage = 'storage';

export interface INoteItem {
    id?: number;
    title: string;
    text: string;
}

export class Note {
    id: number;
    title;
    text;

    constructor(title?, text?) {
        if (typeof title === "object") {
            this.text = title.text;
            this.title = title.title;
            this.id = title.id;
        } else {
            this.text = text || '';
            this.title = title || '';
        }
    }

    setTitle(title: string) {
        this.title = title;
    }

    setText(text: string) {
        this.text = text;
    }
}


export class Storage {
    
    dispatchEvent: (o: any) => any;
    addEventListener: (e: string, Function) => any;
    hasEventListener;
    removeEventListener;
    
    data: INoteItem[] = [];

    constructor() {
        this.importStorage((items) => {
            this.data = items || [];
        });
    }

    add(item: INoteItem) {
        item.id = this.data.length;
        this.data.push(item);
        this.dispatchEvent({type: 'add'});
    }
    
    remove(id) {
        let objects = this.data.filter(o => o.id == id);
        if (!objects.length) {
            debugger;
            throw new Error('elem not found');
        }
        let item = objects[0];
        let idInArr = this.data.indexOf(item);
        if (idInArr === -1) {
            debugger;
            throw new Error('id not found');
        }
        this.data.splice(idInArr, 1);
        this.dispatchEvent({type: 'remove'});
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        let items = this.data.filter(e => e.id === id);
        if (items[0]) {
            return new Note(copyObject(items[0]));
        }
        return null;
    }

    setById(id, newValue) {
        let items = this.data.filter(e => e.id === id);
        if (items.length !== 0) {
            items[0] = newValue;
        }
    }

    importStorage(callback: (data: INoteItem[]) => any) {
        chrome.storage.local.get('storage', (data) => {
            if (data != null) {
                if (isArray(data)) {
                    callback(data);
                }
            }
        });
    }

    exportStorage() {
        chrome.storage.local.set({storage: this.data});
    }
}
EventDispatcher.prototype.apply(Storage.prototype);
export var storage = new Storage();

export function isArray(o: any) {
    return {}.toString.call(o) == '[object Array]';
}

export function copyObject<T>(jsonObject: T): T {
    return JSON.parse(JSON.stringify(jsonObject));
}