import React from "react";
import Marked from "marked";
import is from "is_js";

import {ListItem, Avatar} from "material-ui";

export default class Comment extends React.Component {

    static contextTypes = {
        comment: React.PropTypes.object
    };

    get parsedComment() {
        return {__html: Marked(this.comment)};
    }

    get author() {
        return this.props.author || (this.context.comment ? this.context.comment.author : "") || ""
    }

    get comment() {
        return this.props.children || (this.context.comment ? this.context.comment.comment : "") || this.props.comment || "";
    }

    get listItem() {
        if (this.author.length > 0) {
            return <ListItem
                primaryText={this.author}
                secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}></span>)}
                leftIcon={<Avatar>{this.author[0].toUpperCase()}</Avatar>}
            />;
        }
        return <ListItem
            primaryText={this.author}
            secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}></span>)}
        />;
    }

    render() {
        return (
            <span>
                {this.listItem}
            </span>
        );
    }

}
