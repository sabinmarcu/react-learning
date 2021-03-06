import React from "react";
import Marked from "marked";
import is from "check-types";

import Comment from "../comment";
import styles from "./style.css";

import {selfbind} from "../../helpers/decorator.js";
import {Card, CardText, CardTitle, TextField, CardActions, FlatButton, Paper, List} from "material-ui";

import {Tabs, Tab} from "material-ui";
let {ReactLink, ReactStateSetters} = React.addons;
let ReactTransitionGroup = React.addons.TransitionGroup;

class CommentForm extends React.Component {

    static childContextTypes = {
        comment: React.PropTypes.object,
    };

    linkState(key) {
        return {
            value: this.state[key],
            requestChange: ((component, key) => {
                let partialState = {};
                return (value) => {
                    partialState[key] = value;
                    component.setState(partialState);
                }
            })(this, key),
        };
    }

    get inputs() {
        return (<CardText>
            <TextField
                hintText="Author"
                floatingLabelText="Who are you?"
                fullWidth={true}
                valueLink={this.linkState("author")}
                ref="author" onChange={this.triggerRefreshOnComment}/>
            <TextField
                hintText="Content"
                floatingLabelText="What do you have to say?"
                multiLine={true}
                fullWidth={true}
                valueLink={this.linkState("comment")}
                ref="comment" onChange={this.triggerRefreshOnComment}/>
        </CardText>);
    }

    get preview() {
        return (<CardText style={{padding: "0"}}>
            <List>
                <ReactTransitionGroup>
                    { this.state.comment.length > 0 && this.state.author.length > 0 && <Comment ref="commentComponent" className={this.state.comment.length > 0 ? "bordered" : ""} /> }
                </ReactTransitionGroup>
            </List>
        </CardText>);
    }

    get fullDesign() {
        return (<span className={styles.fullDesign}>
            <Card className={styles.pane}>
                <CardTitle title="Editor" subtitle="Edit your comment here" />
                {this.inputs}
            </Card>
            <Card className={styles.pane}>
                <CardTitle title="Preview" subtitle="Preview your changes here" />
                {this.preview}
            </Card>
        </span>);
    }

    get mobileDesign() {
        return (<Tabs id="mobileDesign">
            <Tab label="Editor">
                <Card>
                    {this.inputs}
                </Card>
            </Tab>
            <Tab label="Preview">
                <Card>
                    {this.preview}
                </Card>
            </Tab>
        </Tabs>);
    }

    state = {
        author: "",
        comment: "",
    };

    getChildContext() {
        return {
            comment: this.state,
        };
    }

    @selfbind
    reset() {
        this.setState({author: "", comment: ""});
    }

    @selfbind
    submit() {
        if (is.assigned(this.props.submitHandle)) {
            this.props.submitHandle(this.refs.author.getValue(), this.refs.comment.getValue());
            this.reset();
        }
    }

    @selfbind
    updateViewport() {
        if (
            (this.viewMode === "mobile" && window.innerWidth > 600) ||
            (this.viewMode === "desktop" && window.innerWidth <= 600)
        ) {
            this.viewMode = (window.innerWidth > 600 ? "desktop" : "mobile");
            this.forceUpdate();
        }
    }

    componentDidMount() {
        this.viewMode = (window.innerWidth > 600 ? "desktop" : "mobile");
        window.addEventListener("resize", this.updateViewport);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateViewport);
    }

    @selfbind
    triggerRefreshOnComment() {
        // this.state.author = this.refs.author.getValue();
        // this.state.comment = this.refs.comment.getValue();
        this.refs.commentComponent.forceUpdate();
    }

    render() {
        let reactiveEditor;
        if (window.innerWidth > 600) {
            reactiveEditor = this.fullDesign;
        } else {
            reactiveEditor = this.mobileDesign;
        }
        return (
            <Card initiallyExpanded={true}>
                <CardTitle title="New Comment" subtitle="Write your code in markdown below" showExpandableButton={true}/>
                <CardText expandable={true} style={{overflow: "hidden"}}>
                    {reactiveEditor}
                </CardText>
                <CardActions expandable={true} style={{clear: "both"}} expandable={true}>
                    <FlatButton label="Reset" onClick={this.reset}/>
                    <FlatButton label="Submit" onClick={this.submit}/>
                </CardActions>
            </Card>
        );
    }
}

export default CommentForm;
