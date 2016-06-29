import './TagInput.css';
import * as React from 'react';
//noinspection TypeScriptCheckImport
import * as TagsInput from 'react-tagsinput';

interface TagInputP {
    onChangeTags: (tags) => any;
    tags: string[]
}

export default class TagInput extends React.Component<TagInputP, any> {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.tags
        }
    }

    componentWillReceiveProps(nextProps: TagInputP) {
        this.setState({
            tags: nextProps.tags
        })
    }

    handleChange(value) {
        this.setState({tags: value});
        this.props.onChangeTags(value);
    }

    renderTag(props) {
        let {tag, key, onRemove, ...other} = props;
        return (
            <span key={key} className={'react-tagsinput-tag' + (tag === 'private' ? ' private-tag' : '')} {...other}>
                {tag}
                <a onClick={(e) => onRemove(key)}/>
            </span>
        );
    }

    render() {
        return (
            <TagsInput
                value={this.state.tags}
                onChange={this.handleChange.bind(this)}
                addOnPaste={true}
                renderTag={this.renderTag}
            />
        )
    }
}