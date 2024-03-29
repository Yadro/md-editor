import * as React from 'react';
import {CompositeDecoratorComponentProps} from "draft-js";
import {ContentBlock} from "draft-js";
import {Entity} from "draft-js";

// fixme
const HANDLE_REGEX = /\@[\w]+/g;
const NOTELINK_REGEX = /\[\w+\]/g;

export function hashtagStrategy(contentBlock: ContentBlock, callback) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function noteLinkStrategy(contentBlock: ContentBlock, callback) {
    findWithRegex(NOTELINK_REGEX, contentBlock, callback);
}

export function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

export const HashtagSpan = (props: CompositeDecoratorComponentProps) => {
    return <span style={{color: 'rgba(95, 184, 138, 1.0)'}}>{props.children}</span>;
};

export const LinkSpan = (props) => {
    const url = Entity.get(props.entityKey).getData().url;
    const open = () => window.open(url,'_blank');
    return (
        <span onClick={open}
              style={{color: 'rgb(17, 85, 204)', textDecoration: 'underline'}}>
            {props.children}
        </span>
    );
};

export const NoteLinkSpanBind = (selectNote: Function) => {
    const NoteLinkSpan = (props: CompositeDecoratorComponentProps) => {
        const title = props.decoratedText.slice(1, -1);
        return (
            <span
                className="NoteLink"
                style={{color: 'rgb(17, 85, 204)', textDecoration: 'underline'}}
                onClick={selectNote.bind(null, title)}>
                {props.children}
            </span>
        );
    };
    return NoteLinkSpan;
};

function findWithRegex(regex, contentBlock: ContentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}