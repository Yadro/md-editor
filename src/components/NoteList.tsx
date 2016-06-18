import * as React from 'react';

const list = [
    'подключить редактор',
    'фильтр',
    'список заметок',
];

var options = [
    {value: 1, text: 'Item One'},
    {value: 2, text: 'Item Two'}
]


export default class NoteList extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            list,
            selected: null
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(key, e) {
        this.setState({
            selected: key
        })
    }

    renderMultiSel(list: Array) {
        const {selected} = this.state;
        const li = list.map((e, key) => {
            return (
                <li key={key}
                    className={'noteListItem' + (key === selected ? ' selected' : '')}
                    onClick={this.handleClick.bind(this, e.value)}>{e.text}</li>
            );
        });
        return (
            <ul className="noteList">{li}</ul>
        )
    }

    render() {
        return this.renderMultiSel(options);
    }
}