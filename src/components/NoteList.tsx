import * as React from 'react';
import {Note} from "../Storage";
import * as moment from "moment";


interface NoteListP {
    notes;
    onSetNote: (id) => any;
    onNewNote: (title: string) => any;
}

export default class NoteList extends React.Component<NoteListP, any> {

    now: number;

    constructor(props) {
        super(props);
        this.state = {
            list: props.notes,
            selected: null,
            searchWord: '',
            focus: false,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.listener = this.listener.bind(this);
        window.addEventListener('keydown', this.listener);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.listener);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.notes
        })
    }

    /**
     * Вызываем onNewNote если input в фокусе и нажат enter
     * @param e
     */
    listener(e) {
        if (e.keyCode === 13 && this.state.focus) {
            // press enter
            console.log(this.state.searchWord);
            this.props.onNewNote(this.state.searchWord);
            this.setState({
                searchWord: ''
            });
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

    onFocus() {
        this.setState({focus: true});
    }

    onBlur() {
        this.setState({focus: false});
    }

    renderNoteList(list: Array) {
        const {selected} = this.state;
        const li = list.map((e: Note, key) => {
            return (
                <li key={key}
                    className={'noteListItem' + (e.id === selected ? ' selected' : '')}
                    onClick={this.onSelectNote.bind(this, e.id)}>
                    <span className="note-text">{e.title}</span>
                    <span className="note-time">{this._getTimeString(e.createTime)}</span>
                </li>
            );
        });
        return (
            <ul>{li}</ul>
        )

    }

    render() {
        this.now = Date.now();
        const searchWord = this.state.searchWord;
        const list = searchWord != '' ?
            this.state.list.filter((el) => {
                return filter(searchWord, el.title);
            }) :
            this.state.list;
        return (
            <div className="noteList">
                <input type="text" onChange={this.handleSearch} onFocus={this.onFocus} onBlur={this.onBlur}/>
                {this.renderNoteList(list)}
            </div>
        )
    }

    _getTimeString(time: number): string {
        if (itsToday(time, this.now)) {
            return 'today at ' + moment(time).format('HH:mm:ss')
        }
        return moment(time).format('dd DD.MM.YY HH:mm:ss');
    }
}

function itsToday(date: number, now: number) {
    return (now - date) <= 24 * 60 * 60 * 1000;
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