//noinspection TypeScriptCheckImport
import {EventDispatcher} from './lib/EventDispatcher'

const nameStorage = 'storage';

export interface INoteItem {
    id?: number;
    title: string;
    text: string;
    tags: string[];
}

export class Note {
    id: number;
    title;
    text;
    tags: string[];

    constructor(title?, text?) {
        if (typeof title === "object") {
            this.text = title.text;
            this.title = title.title;
            this.id = title.id;
            this.tags = title.tags || [];
        } else {
            this.text = text || '';
            this.title = title || '';
            this.tags = [];
        }
    }

    setTitle(title: string) {
        this.title = title;
    }

    setText(text: string) {
        this.text = text;
    }
    
    setTag(tags) {
        this.tags = tags;
    }
}


export class Storage {
    
    dispatchEvent: (o: any) => any;
    addEventListener: (e: string, Function) => any;
    hasEventListener;
    removeEventListener;
    
    data: INoteItem[] = [];
    tags: string[];

    constructor() {
        this.importStorage((items) => {
            this.data = items || this.data || [];
            console.log('load from localstorage', items, this.data);
            this.dispatchEvent({type: 'update'});
        });
    }

    add(item: INoteItem) {
        item.id = this.data.length;
        this.data.push(item);
        this.dispatchEvent({type: 'add'});
        return item;
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

    /**
     * Присваиваем новое значение newValue
     * @param id
     * @param newValue
     */
    setById(id, newValue) {
        this.data = this.data.map(e => {
            if (e.id === id) {
                return newValue;
            }
            return e;
        });
        this.dispatchEvent({type: 'update'});
    }

    importStorage(callback: (data: INoteItem[]) => any) {
        chrome.storage.local.get('storage', (data: any) => {
            if (data.storage != null) {
                if (isArray(data.storage)) {
                    callback(data.storage);
                }
            }
        });
    }

    exportStorage() {
        console.log('save to localstorage', this.data);
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