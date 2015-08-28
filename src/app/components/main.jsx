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

export default class Main extends React.Component {

    state = {
        data: [],
    };

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
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (data) => this.setState({data: data}),
            error: (xhr, status, err) => console.error(this.props.url, status, err.toString()),
        });
    }

    componentDidMount() {
        this.loadData();
        // setInterval(this.loadData, this.props.pollInterval || 5000);
    }

    @selfbind
    addComment(author, content) {
        this.setState({data: this.state.data.concat([{name: author, text: content}])});
    }

    @selfbind
    reset() {
        this.setState({data: []});
    }

    render() {
        let crstyle = {color: "#ddd", textDecoration: "none", marginTop: "10px", position: "relative"};
        return (
            <div className="commentSection">
                <AppBar
                    title="Comments Section"
                    iconElementLeft={<IconButton onClick={this.loadData}><FontIcon className="mdi mdi-refresh" color={Colors.white500} /></IconButton>}
                    iconElementRight={<IconButton onClick={this.reset}><FontIcon className="mdi mdi-close" color={Colors.white500} /></IconButton>}
                />
                <List data={this.state.data} />
                <Form submitHandle={this.addComment}/>
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
