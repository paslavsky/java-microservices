import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card} from "primereact/card";
import {ScrollPanel} from "primereact/scrollpanel";
import _ from "lodash";
import {Chart} from "primereact/chart";

class SampleView extends Component {

    componentDidMount() {
        if (!this.props.sample) {
            this.props.history.push('/404')
        }
    }

    render() {
        return (
            <div className="p-grid">
                <div className="p-sm-12 p-md-12 p-lg-4 p-xl-3" style={{paddingTop: '5em'}}>
                    <div className="p-grid p-justify-around">
                        <Card style={{width: '280px'}}
                              title={this.props.sample.name + ' v.' + this.props.sample.version}
                              subTitle={this.props.sample.description}
                        >
                            <h3>Tags</h3>
                            <ul>
                                {this.props.sample.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
                <div className="p-sm-12 p-md-12 p-lg-8 p-xl-6">
                    <ScrollPanel style={{width: '100%', height: 'calc(100vh - 5.1em)', paddingTop: '4.6em'}}>
                        <Card title="Uptime vs Warming up">
                            <Chart type="line" data={this.props.uptimeAndWarming} options={this.props.uptimeAndWarmingOpts}/>
                        </Card>
                        {
                            this.props.runs.map((run) => (
                                <Card title={run.title} key={run.title} style={{marginTop: '3em'}}>
                                    <Chart type="bar" data={run.data} options={run.options}/>
                                </Card>
                            ))
                        }
                    </ScrollPanel>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const sample = state.metrics.find(it => it.name === ownProps.match.params.sample);
    const memoryColor = '#92afe5';
    const requestTimeColor = '#c6515b';
    const uptimeColor = '#4e8bba';
    const warmingColor = '#a4f77b';
    return {
        sample: sample,
        uptimeAndWarming: {
            labels: sample.metrics.map((it, i) => `Run ${i + 1}`),
            datasets: [
                {
                    label: 'Uptime (ms)',
                    yAxisID: 'Uptime',
                    data: sample.metrics.map((it) => it.uptime),
                    fill: false,
                    backgroundColor: uptimeColor,
                    borderColor: uptimeColor
                },
                {
                    label: 'Warming up (ms)',
                    yAxisID: 'Warming',
                    data: sample.metrics.map((it) => it.requestTime[0] - avg(_.tail(it.requestTime))),
                    fill: false,
                    backgroundColor: warmingColor,
                    borderColor: warmingColor
                }
            ]
        },
        uptimeAndWarmingOpts: {
            scales: {
                yAxes: [{
                    id: 'Uptime',
                    type: 'linear',
                    position: 'left',
                    labelString: 'Mb'
                }, {
                    id: 'Warming',
                    type: 'linear',
                    position: 'right',
                    labelString: 'Mb'
                }]
            }
        },
        runs: sample.metrics.map((runData, i) => ({
            title: `Run ${i + 1}`,
            data: {
                labels: runData.memory.map((it, j) => j),
                datasets: [
                    {
                        label: 'Memory (mb)',
                        yAxisID: 'MB',
                        data: runData.memory.map((it) => it / 1024),
                        fill: false,
                        backgroundColor: memoryColor,
                        borderColor: memoryColor,
                        type: 'line'
                    },
                    {
                        label: 'Request time (ms)',
                        yAxisID: 'MS',
                        data: runData.requestTime,
                        fill: false,
                        backgroundColor: requestTimeColor,
                        borderColor: requestTimeColor,
                        type: 'bar'
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        id: 'MB',
                        type: 'linear',
                        position: 'left',
                        labelString: 'Mb'
                    }, {
                        id: 'MS',
                        type: 'linear',
                        position: 'right',
                        labelString: 'Ms'
                    }]
                }
            }
        }))
    };
};

export default connect(
    mapStateToProps,
)(SampleView);
