import {EventDispatcher} from '../lib/EventDispatcher.js'
import * as _ from 'lodash';
import {config} from "../Config";
const localStorage = chrome.storage.local;

const nameStorage = 'storage';

export type Hash = string;
export interface INoteItem {
    id?: Hash;
    title: string;
    text: string;
    tags: string[];
    createTime: number;
    editTime: number;
}

export class Note {
    id: Hash;
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
            this.id = null;
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

export const SortNotes = {
    create: 'create',
    edit: 'edit'
};
export interface ISettings {
    sort;
    fontSize;
    theme;
}

export class Storage {

    dispatchEvent: (o: any) => any;
    addEventListener: (e: string, Function) => any;
    hasEventListener;
    removeEventListener;

    notes: INoteItem[] = [];
    tags: string[]; // not usage
    settings: ISettings = {
        sort: null,
        fontSize: null,
        theme: null
    };

    constructor() {
        localStorage.get((items: any) => {
            this.notes = items.notes || [];
            this.settings = <ISettings>items.settings || this.settings;
            if (config.debug.storage) {
                console.log('LocalStorage: set date | <Storage>this = ', this);
            }
            this.dispatchEvent({type: 'update'});
        });
    }

    add(item: Note) {
        item.id = makeHash();
        this.notes.push(item);
        this.dispatchEvent({type: 'update'});
        this.exportStorage();
        return item;
    }

    remove(id) {
        let objects = this.notes.filter(o => o.id == id);
        if (!objects.length) {
            debugger;
            console.error('Storage: elem not found id:', id);
        }
        let item = objects[0];
        let idInArr = this.notes.indexOf(item);
        if (idInArr === -1) {
            debugger;
            console.error('Storage: id not found id:', id);
        }
        this.notes.splice(idInArr, 1);
        if (config.debug.storage) {
            console.log(('Storage: Remove note id:' + id));
        }
        this.exportStorage();
        this.dispatchEvent({type: 'remove'});
    }

    getAll(privateMode: boolean) {
        if (privateMode) {
            return sort(this.notes, this.settings.sort);
        } else {
            return sort(
                this.notes.filter((item) => item.tags.indexOf('private') === -1),
                this.settings.sort
            );
        }
    }

    getById(id) {
        let items = this.notes.filter(e => e.id === id);
        if (items[0]) {
            return new Note(copyObject(items[0]));
        }
        return null;
    }

    getByTitle(title: string) {
        let items = this.notes.filter(e => e.title === title);
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
    setById(id: Hash, newValue: Note) {
        newValue.editTime = Date.now();
        this.notes = this.notes.map(e => {
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
    setByIdSaveDate(id: Hash, newValue: Note) {
        if (config.debug.storage) {
            console.log('Storage: save with edit time', newValue);
        }
        newValue.editTime = Date.now();
        this.setById(id, newValue);
    }

    getSettings(): ISettings {
        return this.settings;
    }

    setSettings(settings: ISettings) {
        if (config.debug.storage) {
            console.log('Storage: set settings', settings);
        }
        this.settings = settings;
        this.exportStorage();
    }

    exportStorage() {
        const obj = {
            notes: this.notes,
            settings: this.settings
        };
        if (config.debug.storage) {
            console.log('Storage: save to LocalStorage ', obj);
        }
        localStorage.set(obj);
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

export function makeHash(): Hash {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 21; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const sortField = {
    'create': 'createTime',
    'edit': 'editTime'
};
function sort(items: (Note|INoteItem)[], field) {
    var p = sortField[field];
    return items.sort((a, b) => {
        return a[p] < b[p] ? 1 : (a[p] === b[p] ? 0 : -1);
    })
}