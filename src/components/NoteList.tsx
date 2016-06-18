import * as React from 'react';

var options = [
    {id: 1, text: 'Item One'},
    {id: 2, text: 'Item Two'},
    {id: 3, text: 'Item One'},
    {id: 4, text: 'Item Two'},
    {id: 5, text: 'Item One'},
    {id: 6, text: 'Item Two'},
]

interface NoteListP {
    notes;
    onSetNote: (id) => any;
    onNewNote: (title: string) => any;
}

export default class NoteList extends React.Component<NoteListP, any> {

    constructor(props) {
        super(props);
        this.state = {
            list: props.notes || options,
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

    listener(e) {
        if (e.keyCode === 13 && this.state.focus) {
            // press enter
            console.log(this.state.searchWord);
            this.props.onNewNote(this.state.searchWord);
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

    renderMultiSel(list: Array) {
        const {selected} = this.state;
        const li = list.map((e, key) => {
            return (
                <li key={key}
                    className={'noteListItem' + (e.id === selected ? ' selected' : '')}
                    onClick={this.onSelectNote.bind(this, e.id)}>{e.text}</li>
            );
        });
        return (
            <ul>{li}</ul>
        )

    }

    render() {
        const searchWord = this.state.searchWord;
        const list = this.state.list.filter((el) => {
            return el.text.search(searchWord) !== -1;
        });
        return (
            <div className="noteList">
                <input type="text" onChange={this.handleSearch} onFocus={this.onFocus} onBlur={this.onBlur}/>
                {this.renderMultiSel(list)}
            </div>
        )
    }
}

function listener() {

}