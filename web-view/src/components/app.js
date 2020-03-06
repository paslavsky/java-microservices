import React from "react";
import {connect} from "react-redux";
import {fetchGitHubRelease} from "../actions";
import {HashRouter, Route, Switch} from "react-router-dom";
import {ProgressSpinner} from "primereact/progressspinner";
import Dashboard from "./dashboard";
import AppMenu from "./app-menu";
import SampleView from "./sample-view";
import NotFound from "./404";
import Doc from "./doc";


class App extends React.Component {
    componentDidMount() {
        this.props.fetchGitHubRelease();
    }

    render() {
        if (!this.props.loaded)
            return (
                <ProgressSpinner/>
            );
        return (
            <HashRouter>
                <AppMenu/>

                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/404" component={NotFound}/>
                    <Route exact path="/docs/:doc" component={Doc}/>
                    <Route exact path="/:sample" component={SampleView}/>
                </Switch>
            </HashRouter>
        );
    }
}

const mapStateToProps = state => {
    return {
        loaded: !!state.ghRelease && !!state.metrics
    }
};

export default connect(mapStateToProps, {fetchGitHubRelease})(App);
