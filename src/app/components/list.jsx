import React from "react";
import Comment from "./comment.jsx";

import { Card, List, CardTitle, CardText } from "material-ui"

export default class CommentList extends React.Component {

    render() {
        let nodes = this.props.data.map((comment) => <Comment author={comment.name}>{comment.text}</Comment>);

        return (
            <Card initiallyExpanded={true}>
                <CardTitle
                    title="Comments List"
                    subtitle="See what people are talking about"
                    showExpandableButton={true}>
                </CardTitle>
                <CardText expandable={true} style={{padding: "0"}}>
                    <List>
                        {nodes}
                    </List>
                </CardText>
            </Card>
        );
    }
}
