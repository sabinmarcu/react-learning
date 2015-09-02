import React from "react";
import Marked from "marked";

import {ListItem, Avatar} from "material-ui";
import is from "check-types";

import styles from "./style";
import $ from "jQuery";

export default class Comment extends React.Component {

    state = {
        mounted: false,
        styles: {},
        height: 0,
    }

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

    get wrapperStyles() {
        if (this.state.mounted) {
            let node = React.findDOMNode(this);
            let styles = window.getComputedStyle(node, null);
            node.style.height = 'auto';
            node.style.height = node.offsetHeight + "px";
            return {
                height: node.offsetHeight + "px",
                opacity: 1,
                display: "block",
            };
        } else {
            return {
                height: 0,
                opacity: 0,
                display: "block",
            };
        }
    }

    mount() {
        let node = React.findDOMNode(this); node.style.height = "auto";
        let styles = window.getComputedStyle(node, null);
        this.setState({
            styles: {
                height: 0,
                opacity: 0,
                display: "block",
            }, height: styles.height,
        });
        setTimeout(() => {
            this.setState({
                styles: {
                    height: this.state.height,
                    opacity: 1,
                    display: "block",
                },
            });
            setTimeout(() => this.setState({
                styles: {
                    height: "auto",
                    opacity: 1,
                    display: "block",
                },
            }), 1000);
        }, 100);
    }

    unmount() {
        let node = React.findDOMNode(this); node.style.height = "auto";
        let styles = window.getComputedStyle(node, null);
        this.setState({
            styles: {
                height: styles.height,
                opacity: 0,
                display: "block",
            },
        });
        setTimeout(() => this.setState({
            styles: {
                height: "0px",
                opacity: 0,
                display: "block",
            },
        }), 100);
    }
    componentDidMount() {
        this.mount();
    }
    // componentWillReceiveProps() {
    //     this.mount();
    // }

    componentDidUnmount() {
        this.unmount();
    }

    componentWillLeave(callback) {
        this.unmount();
        setTimeout(callback, 1000);
    }

    render() {
        return <span
            style={this.state.styles}
            className={styles.wrapper}>
                {this.listItem}
            </span>;
    }

}
