import React, {Component} from 'react';
import {connect} from 'react-redux';

class SampleView extends Component {

    componentDidMount() {
        if (!this.props.sample) {
            this.props.history.push('/404')
        }
    }

    render() {
        return (<h1 style={{paddingTop: '1em'}}>Sample {this.props.match.params.sample}</h1>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        sample: state.metrics.find(it => it.name === ownProps.match.params.sample)
    };
};

export default connect(
    mapStateToProps,
)(SampleView);
