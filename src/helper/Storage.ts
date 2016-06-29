import {EventDispatcher} from '../lib/EventDispatcher.js'
import * as _ from 'lodash';

const nameStorage = 'storage';

export interface INoteItem {
    id?: number;
    title: string;
    text: string;
    tags: string[];
    createTime: number;
    editTime: number;
}

export class Note {
    id: number;
    title;
    text;
    tags: string[];
    createTime: number;
    editTime: number;

    constructor(title?, text?) {
        if (typeof title === "object") {
            // import existing note
            this.text = title.text;
            this.title = title.title;
            this.id = title.id;
            this.tags = title.tags || [];
            this.createTime = title.createTime || Date.now();
            this.editTime = title.editTime || this.createTime;
        } else {
            // create new note
            this.text = text || '';
            this.title = title || '';
            this.tags = [];
            this.createTime = Date.now();
            this.editTime = this.createTime;
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
        this.dispatchEvent({type: 'update'});
        this.exportStorage();
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
        this.dispatchEvent({type: 'update'});
    }

    getAll(privateMode: boolean) {
        if (privateMode) {
            return this.data;
        } else {
            return this.data.filter((item) => item.tags.indexOf('private') === -1);
        }
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
    setById(id: number, newValue: Note) {
        newValue.editTime = Date.now();
        this.data = this.data.map(e => {
            if (e.id === id) {
                return newValue;
            }
            return e;
        });
        this.dispatchEvent({type: 'update'});
    }

    /**
     * Присваиваем новое значение newValue
     * сохраняем время изменений
     * @param id
     * @param newValue
     */
    setByIdSaveDate(id: number, newValue: Note) {
        newValue.editTime = Date.now();
        this.setById(id, newValue);
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