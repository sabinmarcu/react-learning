import React from "react";
import Comment from "./comment";

import { Card, List, CardTitle, CardText } from "material-ui";

let ReactTransitionGroup = React.addons.TransitionGroup;

export default class CommentList extends React.Component {

    render() {
        let nodes = this.props.indexes.map(
            (comment,index, array) =>
                <Comment
                    key={comment}
                    author={this.props.data[comment].author}
                    class={index !== array.length - 1 ? "bordered" : ""}>
                        {this.props.data[comment].comment}
                </Comment>
        );

        return (
            <Card initiallyExpanded={true}>
                <CardTitle
                    title="Comments List"
                    subtitle="See what people are talking about"
                    showExpandableButton={true}>
                </CardTitle>
                <CardText expandable={true} style={{padding: "0"}}>
                    <List>
                        <ReactTransitionGroup>
                            {nodes}
                        </ReactTransitionGroup>
                    </List>
                </CardText>
            </Card>
        );
    }
}
