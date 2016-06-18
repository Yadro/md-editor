import * as React from 'react';

const list = [
    'подключить редактор',
    'фильтр',
    'список заметок',
];

var options = [
    {id: 1, text: 'Item One'},
    {id: 2, text: 'Item Two'},
    {id: 3, text: 'Item One'},
    {id: 4, text: 'Item Two'},
    {id: 5, text: 'Item One'},
    {id: 6, text: 'Item Two'},
]


export default class NoteList extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            list,
            selected: null,
            searchWord: ''
        };
        this.handleSearch = this.handleSearch.bind(this);
        // this.handleClick = this.handleClick.bind(this);
    }

    handleClick(key, e) {
        this.setState({
            selected: key
        });
        // this.props.callback(key);
    }

    handleSearch(e: Event) {
        const word = e.target.value;
        this.setState({
            searchWord: word
        })
    }

    renderMultiSel(list: Array) {
        const {selected} = this.state;
        const li = list.map((e, key) => {
            return (
                <li key={key}
                    className={'noteListItem' + (e.id === selected ? ' selected' : '')}
                    onClick={this.handleClick.bind(this, e.id)}>{e.text}</li>
            );
        });
        return (
            <ul>{li}</ul>
        )

    }

    render() {
        const searchWord = this.state.searchWord;
        const list = options.filter((el) => {
            return el.text.search(searchWord) !== -1;
        });
        return (
            <div className="noteList">
                <input type="text" onChange={this.handleSearch}/>
                {this.renderMultiSel(list)}
            </div>
        )
    }
}