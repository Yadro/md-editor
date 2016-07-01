import './Settings.css';

import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";
import {consoleWarn} from "../helper/Tools";
import {config} from "../Config";

const SortNotes = {
    create: 'create',
    edit: 'edit'
};

interface SortDataItem {
    text;
    value;
}
const sortData: SortDataItem[] = [
    {
        text: 'create date',
        value: SortNotes.create
    }, {
        text: 'edit date',
        value: SortNotes.edit
    }
];

interface SelectNotesP extends SimpleRouterInjProps {
    sortType?: boolean;
}

interface SelectNotesS {
    checkbox?;
    sortType?;
}

export default class Settings extends React.Component<SelectNotesP, SelectNotesS> {

    constructor(props) {
        super(props);
        this.state = {
            checkbox: false,
            sortType: props.sortType || null
        };
        [
            'onClickCheckbox',
            'onGoBack',
            'setRadioValue',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }

    onClickCheckbox() {
        this.setState({
            checkbox: !this.state.checkbox
        })
    }

    onGoBack() {
        this.props.go('App', {sortType: this.state.sortType});
    }

    setRadioValue(field: string, value: any) {
        const obj = {};
        obj[field] = value;
        this.setState(obj);
    }

    radioBox(variants: SortDataItem[], field: string) {
        const sortType = this.state.sortType;
        return variants.map((el, key) => {
            return (
                <li key={key} onClick={this.setRadioValue.bind(null, field, el.value)}>
                    <input type="radio" checked={sortType === el.value}/>
                    <label>{el.text}</label>
                </li>
            )
        });
    }

    render() {
        return (
            <div className="settings">
                <button onClick={this.onGoBack}>{'<-'}</button>
                <span><b>Settings</b></span>
                <div className="settings-list"> 
                    <ul>
                        <b>Sorting:</b>
                        {this.radioBox(sortData, 'sortType')}
                    </ul>
                    <input type="checkbox" onChange={this.onClickCheckbox} value={this.state.checkbox}/>
                </div>
            </div>
        )
    }
}