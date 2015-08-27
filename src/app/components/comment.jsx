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
                leftIcon={<Avatar style={{lineHeight: "24px"}}>{this.author[0].toUpperCase()}</Avatar>}
                style={{paddingLeft: "10px", overflow: "auto"}}
            />;
        }
        return <ListItem
            primaryText={this.author}
            secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}
                style={{paddingLeft: "10px", overflow: "auto"}}></span>)}
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
