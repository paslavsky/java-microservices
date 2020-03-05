import React from "react";
import {connect} from "react-redux";
import {fetchGitHubRelease} from "../actions";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ProgressSpinner} from "primereact/progressspinner";
import Dashboard from "./dashboard";
import AppMenu from "./app-menu";
import SampleView from "./sample-view";
import NotFound from "./404";


class App extends React.Component {
    componentDidMount() {
        this.props.fetchGitHubRelease();
    }

    render() {
        const loaded = this.props.loaded;
        if (!loaded)
            return (
                <ProgressSpinner/>
            );
        return (
            <BrowserRouter>
                <AppMenu/>

                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/404" component={NotFound}/>
                    <Route exact path="/:sample" component={SampleView}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    return {
        loaded: !!state.ghRelease && !!state.metrics
    }
};

export default connect(mapStateToProps, {fetchGitHubRelease})(App);
