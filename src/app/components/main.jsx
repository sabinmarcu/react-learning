import React from "react";

import List from "./list.jsx";
import Form from "./form.jsx";
import { AppBar, FlatButton, IconButton, FontIcon } from "material-ui";

import $ from "jquery";
import {selfbind} from "../helpers/decorator.js";

import mui from "material-ui";
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors

import materialdesignicons from "../vendor/mdi/css/materialdesignicons.css";

export default class Main extends React.Component {

    state = {
        data: []
    };

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    @selfbind
    loadData() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (data) => this.setState({data: data}),
            error: (xhr, status, err) => console.error(this.props.url, status, err.toString())
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
        return (
            <div className="commentSection">
                <AppBar
                    title="Comments Section"
                    iconElementLeft={<IconButton onClick={this.loadData}><FontIcon className="mdi mdi-refresh" color={Colors.white500} /></IconButton>}
                    iconElementRight={<IconButton onClick={this.reset}><FontIcon className="mdi mdi-close" color={Colors.white500} /></IconButton>}
                />
                <List data={this.state.data} />
                <Form submitHandle={this.addComment}/>
            </div>
        );
    }
}
