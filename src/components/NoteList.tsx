import '../../style/components/NoteList.css';
import * as React from 'react';
import {Note, storage, Hash, ISettings} from "../helper/Storage";
import * as moment from "moment";
import {config} from "../Config";
import {consoleWarn} from "../helper/Tools";
import SyntheticEvent = __React.SyntheticEvent;
import {SortNotes} from "../helper/Storage";


const keyCodeEnter = 13;
const keyCodesDel = 46;

interface NoteListP {
    notes;
    onSetNote: (id) => any;
    onNewNote: (title: string) => any;
    currentNote: Hash;
}

interface NoteListS {
    list?;
    selected?;
    searchWord?;
    searchFocus?;
    settings?: ISettings;
}

export default class NoteList extends React.Component<NoteListP, NoteListS> {

    now: moment.Moment;

    constructor(props) {
        super(props);
        this.state = {
            list: props.notes,
            selected: null,
            searchWord: '',
            searchFocus: false,
            settings: storage.getSettings()
        };

        [
            'handleSearch',
            'onSearchFocus',
            'onSearchBlur',
            'listener',
        ].forEach((fn) => this[fn] = this[fn].bind(this));
    }


    componentDidMount() {
        window.addEventListener('keyup', this.listener);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.listener);
    }

    componentWillReceiveProps(nextProps: NoteListP) {
        this.setState({
            list: nextProps.notes,
            selected: nextProps.currentNote
        })
    }

    /**
     * Вызываем onNewNote если input в фокусе и нажат enter
     * @param e
     */
    listener(e: KeyboardEvent) {
        if (e.keyCode === keyCodeEnter && this.state.searchFocus) {
            // press enter
            this.props.onNewNote(this.state.searchWord);
            this.setState({
                searchWord: ''
            });
        } else if ((e.metaKey || e.ctrlKey) && e.keyCode === keyCodesDel) {
            storage.remove(this.state.selected);
        }
    }

    onSelectNote(key, e) {
        this.setState({
            selected: key
        });
        this.props.onSetNote(key);
    }

    handleSearch(e: Event) {
        const word = e.target.value;
        this.setState({
            searchWord: word
        })
    }

    onSearchFocus() {
        this.setState({searchFocus: true});
    }

    onSearchBlur() {
        this.setState({searchFocus: false});
    }

    renderNoteList(list: Array) {
        const {selected} = this.state;

        const li = list.map((note: Note, key) => {
            return (
                <li key={key}
                    className={'noteListItem' + (note.id === selected ? ' selected' : '')}
                    onClick={this.onSelectNote.bind(this, note.id)}>
                    <span className="note-text">{note.title}</span>
                    <span className="note-preview">{getPreviewText(note.text)}</span>
                    <span className="note-time">{this._getTimeString(note)}</span>
                </li>
            );
        });
        return (
            <ul>{li}</ul>
        )

    }

    render() {
        this.now = moment();
        const searchWord = this.state.searchWord;
        const list = searchWord != '' ?
            this.state.list.filter((el) => {
                return filter(searchWord, el.title);
            }) :
            this.state.list;
        return (
            <div className="noteList">
                <input type="text" onChange={this.handleSearch} onFocus={this.onSearchFocus} onBlur={this.onSearchBlur}/>
                {this.renderNoteList(list)}
            </div>
        )
    }

    _getTimeString(note: Note): string {
        let prefix = '';
        const sort = this.state.settings.sort;
        const time = (sort === SortNotes.create) ? note.createTime : note.editTime ;
        if (sort === SortNotes.edit) {
            prefix = 'edit ';
        }
        if (itsTodayTime(time, this.now)) {
            return prefix + moment(time).format('HH:mm')
        }
        return prefix + moment(time).format('dd DD.MM');
    }

    _getTimeStringPrefix(note: Note): string {
        let prefix = '';
        if (note.createTime !== note.editTime) {
            prefix += 'last edit '
        }
        if (itsTodayTime(note.editTime, this.now)) {
            return prefix + 'today at ' + moment(note.editTime).format('HH:mm:ss')
        }
        return prefix + moment(note.editTime).format('dd DD.MM.YY HH:mm:ss');
    }
}

function getPreviewText(text: string): string {
    return ' - ' + text.slice(0, 20);
}

function itsTodayTime(date: number, now: moment.Moment) {
    const _date = moment(date);
    return (
        _date.year() === now.year() &&
        _date.dayOfYear() === now.dayOfYear()
    );
}

function filter(query: string, string: string) {
    string = string.toLocaleLowerCase();
    query = query.toLocaleLowerCase();
    const tokens = query.split(/[,.:;'"?!\-_ ]/);
    return tokens.some((token) => {
        if (token === '') return false;
        return string.search(token) !== -1;
    })
}