import React from "react";
import Marked from "marked";

import {ListItem, Avatar} from "material-ui";
import is from "check-types";

import styles from "./style";


export default class Comment extends React.Component {

    static contextTypes = {
        comment: React.PropTypes.object,
    };

    get itemClasses() {
        let s = styles.listItem;
        if (this.props.class || this.props.className) {
            s += " " + (this.props.class || this.props.className);
        }
        return s;
    }

    get parsedComment() {
        return {__html: Marked(this.comment)};
    }

    get author() {
        if (is.assigned(this.props) && is.assigned(this.props.author)) {
            return this.props.author;
        }
        if (is.assigned(this.context) && is.assigned(this.context.comment) && is.assigned(this.context.comment.author)) {
            return this.context.comment.author
        }
        return "";
    }

    get comment() {
        if (is.assigned(this.props) && is.assigned(this.props.children)) {
            return this.props.children;
        }
        if (is.assigned(this.props) && is.assigned(this.props.comment)) {
            return this.props.comment;
        }
        if (is.assigned(this.context) && is.assigned(this.context.comment) && is.assigned(this.context.comment.comment)) {
            return this.context.comment.comment
        }
        return "";
    }

    get listItem() {
        if (this.author.length > 0) {
            return this.iconItem;
        }
        return this.noIconItem;
    }

    get iconItem() {
        return (<ListItem
            primaryText={this.author}
            secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}></span>)}
            leftIcon={<Avatar className={styles.avatar}>{this.author[0].toUpperCase()}</Avatar>}
            className={this.itemClasses}
        />);
    }

    get noIconItem() {
        return (<ListItem
            primaryText={this.author}
            secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}></span>)}
            className={this.itemClasses}
        />);
    }

    render() {
        return (
            <span>
                {this.listItem}
            </span>
        );
    }

}
