import * as React from 'react';
import * as TagsInput from 'react-tagsinput';
debugger;

const names = [
    "Aaliyah",
    "Aarushi",
    "Abagail",
    "Abbey",
    "Abbi",
    "Abbie",
    "Abby",
    "Abi",
    "Abia",
    "Abigail",
    "Aby",
    "Acacia",
    "Ada",
    "Adalia",
    "Adalyn",
    "Addie",
    "Addison",
    "Adelaide",
    "Adele",
    "Adelia",
    "Adelina",
    "Adeline",
    "Adreanna",
    "Adriana",
    "Adrianna",
    "Adrianne",
    "Adrienne",
    "Aerona",
    "Agatha",
    "Aggie",
    "Agnes",
    "Aida",
]

interface TagInputP {

}

export default class TagInput extends React.Component<TagInputP, any> {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            loading: false,
            selected: [],
            tags: ["tag1", "tag2"]
        }
    }

    handleChange(value) {

        this.setState({tags: value});
    }

    render() {
        return (
            <TagsInput
                value={this.state.tags}
                onChange={this.handleChange.bind(this)}
                addOnPaste={true}
            />
        )
    }
}