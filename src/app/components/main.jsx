import React from "react";

import List from "./list";
import Form from "./form";
import { AppBar, FlatButton, IconButton, FontIcon } from "material-ui";

import $ from "jquery";
import {selfbind} from "../helpers/decorator.js";

import mui from "material-ui";
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors

import materialdesignicons from "mdi/css/materialdesignicons.css";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const ctx = require.context('../actions/', true, /\.(js|ls|jsx)$/);
const actions = ctx.keys().reduce(
    (prev, key) => (prev[key.replace(/.*\/([^\.]*)\.(js|ls|jsx)$/, "$1")] = ctx(key)) && prev
, {});

@connect(state => {
    return {
        comms: state[0].comments,
        commsMap: state[0].commentsById,
    }
})
export default class Main extends React.Component {

    static propTypes = {
        comms: React.PropTypes.array.isRequired,
        commsMap: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    };

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    @selfbind
    loadData() {
        const {dispatch} = this.props, db = require("../helpers/db");
        db.get("state").then((state) => {
            let {comments: comms, commentsById: map} = state.state;
            dispatch(actions.resetComments());
            comms.map(
                (comm) => dispatch(
                    actions.addComment(
                        map[comm].author,
                        map[comm].comment
                    )
                )
            );
            this.loadRemote();
        }, this.loadRemote);
    }

    @selfbind
    loadRemote() {
        const {dispatch} = this.props;
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (data) => data.map((it) => dispatch(actions.addComment(it.author, it.comment))),
            error: (xhr, status, err) => console.error(this.props.url, status, err.toString()),
        })
    }

    componentDidMount() {
        this.loadData();
        // setInterval(this.loadData, this.props.pollInterval || 5000);
    }

    render() {
        let crstyle = {color: "#ddd", textDecoration: "none", marginTop: "10px", position: "relative"};
        const { comms: comments, commsMap: commentsMap, dispatch } = this.props;
        let boundActions = bindActionCreators(actions, dispatch)

        return (
            <div className="commentSection">
                <AppBar
                    title="Comments Section"
                    iconElementLeft={<IconButton onClick={this.loadData}><FontIcon className="mdi mdi-refresh" color={Colors.white500} /></IconButton>}
                    iconElementRight={<IconButton onClick={boundActions.resetComments}><FontIcon className="mdi mdi-close" color={Colors.white500} /></IconButton>}
                />
                <List indexes={comments} data={commentsMap} />
                <Form submitHandle={boundActions.addComment}/>
                <div className="footer"><span id="links">
                    <a href="https://facebook.com/sabinmarcu">
                        <FontIcon className="mdi mdi-18px mdi-facebook" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>
                    <a href="https://twitter.com/sabinmarcu">
                        <FontIcon className="mdi mdi-18px mdi-twitter" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>
                    <a href="https://github.com/sabinmarcu">
                        <FontIcon className="mdi mdi-18px mdi-github-circle" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>
                    <a href="https://linkedin.com/in/sabinmarcu">
                        <FontIcon className="mdi mdi-18px mdi-linkedin" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>
                </span>
                    Copyright Sabin Marcu 2015
                    <a href="https://sabinmarcu.github.com/" id="ownsite">
                        <FontIcon className="mdi mdi-18px mdi-link" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>

                    <a id="thisrepo" href="https://github.com/sabinmarcu/react-learning" style={{color: "#ddd", textDecoration: "none"}}>
                        <span>This Repo</span>
                        <FontIcon className="mdi mdi-18px mdi-github-box" color={Colors.white500} style={{color: "#ccc", fontSize: "14pt !important", margin: "0 2px 0 0"}} />
                    </a>
                </div>
            </div>
        );
    }
}
