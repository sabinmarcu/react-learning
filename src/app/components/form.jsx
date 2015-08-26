import React from "react";
import Marked from "marked";
import is from "is_js";

import Comment from "./comment.jsx";

import {selfbind} from "../helpers/decorator";
import {Card, CardText, CardTitle, TextField, CardActions, FlatButton, Paper, List} from "material-ui";

export default class CommentForm extends React.Component {

    static childContextTypes = {
        comment: React.PropTypes.object
    };

    commentPayload = {
        author: "",
        comment: ""
    };

    getChildContext() {
        return {
            comment: this.commentPayload
        };
    }

    @selfbind
    reset() {
        this.refs.author.setValue("");
        this.refs.comment.setValue("");
    }

    @selfbind
    submit() {
        if (is.existy(this.props.submitHandle)) {
            this.props.submitHandle(this.refs.author.getValue(), this.refs.comment.getValue());
        }
    }

    @selfbind
    triggerRefreshOnComment() {
        this.commentPayload.author = this.refs.author.getValue();
        this.commentPayload.comment = this.refs.comment.getValue();
        this.refs.commentComponent.forceUpdate();
    }

    render() {
        return (
            <Card initiallyExpanded={false}>
                <CardTitle title="New Comment" subtitle="Write your code in markdown below" showExpandableButton={true}/>
                <CardText expandable={true} style={{overflow: "hidden"}}>
                    <div zDepth={1} style={{width: "50%", float: "left"}}>
                        <Card style={{margin: "0"}}>
                            <CardTitle title="Editor" subtitle="Edit your comment here" />
                            <CardText>
                                <TextField
                                    hintText="Author"
                                    floatingLabelText="Who are you?"
                                    fullWidth={true}
                                    ref="author" onChange={this.triggerRefreshOnComment}/>
                                <TextField
                                    hintText="Content"
                                    floatingLabelText="What do you have to say?"
                                    multiLine={true}
                                    fullWidth={true}
                                    ref="comment" onChange={this.triggerRefreshOnComment}/>
                            </CardText>
                        </Card>
                    </div>
                    <div zDepth={1} style={{width: "50%", float: "right"}}>
                        <Card style={{margin: "0"}}>
                            <CardTitle title="Preview" subtitle="Preview your changes here" />
                            <CardText style={{padding: "0"}}>
                                <List>
                                    <Comment ref="commentComponent"></Comment>
                                </List>
                            </CardText>
                        </Card>
                    </div>
                </CardText>
                <CardActions expandable={true} style={{clear: "both"}} expandable={true}>
                    <FlatButton label="Reset" onClick={this.reset}/>
                    <FlatButton label="Submit" onClick={this.submit}/>
                </CardActions>
            </Card>
        );
    }
}
