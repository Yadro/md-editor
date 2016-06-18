const nameStorage = 'storage';

export interface INoteItem {
    id: number;
    title: string;
    text: string;
}

export default class Storage {

    data: INoteItem[];

    constructor() {
        this.data = this.importStorage() || [];
    }

    add(item: INoteItem) {
        item.id = this.data.length;
        this.data.push(item)
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
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        let items = this.data.filter(e => e.id === id);
        if (items[0]) {
            return copyObject(items[0]);
        }
        return null;
    }

    setById(id, newValue) {
        let items = this.data.filter(e => e.id === id);
        if (items.length !== 0) {
            items[0] = newValue;
        }
    }

    importStorage(): INoteItem[] {
        let raw = localStorage.getItem(nameStorage);
        if (raw != "undefined" && raw != '') {
            let items = JSON.parse(raw);
            if (isArray(items)) {
                return items;
            }
        }
    }

    exportStorage() {
        localStorage.setItem(nameStorage, JSON.stringify(this.data));
    }
}

export function isArray(o: any) {
    return {}.toString.call(o) == '[object Array]';
}

export function copyObject<T>(jsonObject: T): T {
    return JSON.parse(JSON.stringify(jsonObject));
}