import '../../style/components/Settings.css';

import * as React from 'react';
import {SimpleRouterInjProps} from "../lib/SimpleRouter";
import {consoleWarn} from "../helper/Tools";
import {config} from "../Config";
import {storage, SortNotes} from "../helper/Storage";
import FileLoader from "./FileLoader";

const ThemeType = {
    light: 'light',
    dark: 'dark'
};

interface RadioButtonItem {
    text;
    value;
}
const RadioSort: RadioButtonItem[] = [
    {
        text: 'create date',
        value: SortNotes.create
    }, {
        text: 'edit date',
        value: SortNotes.edit
    }
];

const RadioTheme: RadioButtonItem[] = [
    {
        text: 'Light',
        value: ThemeType.light
    }, {
        text: 'Dark',
        value: ThemeType.dark
    }
];

interface SelectNotesP extends SimpleRouterInjProps {
    sortType?: boolean;
}

interface SelectNotesS {
    checkbox?;
    sortType?;
    settings?;
}

export default class Settings extends React.Component<SelectNotesP, SelectNotesS> {

    constructor(props) {
        super(props);
        this.state = {
            checkbox: false,
            settings: storage.getSettings()
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
        storage.setSettings(this.state.settings);
        this.props.go('App', {});
    }

    setRadioValue(field: string, value: any) {
        const {settings} = this.state;
        settings[field] = value;
        this.setState({settings: settings});
    }

    radioBox(variants: RadioButtonItem[], field: string) {
        const current = this.state.settings[field];
        return variants.map((el, id) => {
            const key = field + id;
            return (
                <li key={key}>
                    <input id={key} type="radio"
                           checked={current === el.value}
                           onChange={this.setRadioValue.bind(null, field, el.value)}/>
                    <label htmlFor={key}>{el.text}</label>
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
                        {this.radioBox(RadioSort, 'sort')}
                    </ul>
                    <ul>
                        <b>Theme:</b>
                        {this.radioBox(RadioTheme, 'theme')}
                    </ul>
                    <input type="checkbox" onChange={this.onClickCheckbox} value={this.state.checkbox}/>
                </div>
                <button onClick={() => this.props.go('Help')}>Help</button>
                <hr/>
                <FileLoader />
            </div>
        )
    }
}