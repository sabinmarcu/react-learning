import React from "react";
import Marked from "marked";
import is from "is_js";

import {ListItem, Avatar} from "material-ui";

export default class Comment extends React.Component {

    static contextTypes = {
        comment: React.PropTypes.object
    };

    get parsedComment() {
        return {__html: Marked(this.props.children || (this.context.comment ? this.context.comment.comment : "") || this.props.comment || "")};
    }

    render() {
        return (
            <span>
                <ListItem
                    primaryText={this.props.author || (this.context.comment ? this.context.comment.author : "") || ""}
                    secondaryText={(<span dangerouslySetInnerHTML={this.parsedComment}></span>)}
                    leftIcon={<Avatar>{(this.props.author || (this.context.comment ? this.context.comment.author : "") || "")[0].toUpperCase()}</Avatar>}
                />
            </span>
        );
    }

}
