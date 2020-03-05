import React, {useState} from "react";
import {connect} from 'react-redux';
import {Chart} from "primereact/chart";
import _ from 'lodash';
import {Card} from "primereact/card";
import {ScrollPanel} from "primereact/scrollpanel";
import {SelectButton} from "primereact/selectbutton";
import ChartCard from "./chart-card";

const Dashboard = (props) => {
    const [chartType, setChartType] = useState("bar");
    const types = [
        {label: 'Vertical Bar', value: 'bar'},
        {label: 'Horizontal Bar', value: 'horizontalBar'},
    ];
    return (
        <div className="p-grid">
            <div className="p-sm-12 p-md-12 p-lg-4 p-xl-3" style={{paddingTop: '5em'}}>
                <div className="p-grid p-justify-around">
                    <Card style={{width: '280px'}}>
                        <SelectButton value={chartType} options={types} onChange={(e) => setChartType(e.value)}/>
                    </Card>
                </div>
            </div>
            <div className="p-sm-12 p-md-12 p-lg-8 p-xl-6">
                <ScrollPanel style={{width: '100%', height: 'calc(100vh - 5.1em)', paddingTop: '5em'}}>
                    <ChartCard title="Memory on start (Mb)" chartType={chartType} data={props.memoryOnStart} first={true}/>

                    <ChartCard title="Working memory (Mb)" chartType={chartType} data={props.memoryOnWork}/>

                    <ChartCard title="Uptime (ms)" chartType={chartType} data={props.uptime}/>

                    <ChartCard title="Warming up (ms)" chartType={chartType} data={props.warmingUp}/>

                    <ChartCard title="Request time (ms)" chartType={chartType} data={props.requestTime}/>
                </ScrollPanel>
            </div>
        </div>
    );
};


const mapStateToProps = state => {
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const statistics = arr => ([avg(arr), Math.max(...arr), Math.min(...arr)]);

    const colors = _.zipObject(
        state.metrics.map(sample => (sample.name)),
        state.metrics.map(() => ('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)))
    );

    return ({
        samples: _.zipObject(
            state.metrics.map(sample => (sample.name)),
            state.metrics.map(sample => (sample.tags))
        ),
        uptime: {
            labels: ['Avg', 'Max', 'Min'],
            datasets: state.metrics.map(sample => ({
                label: sample.name,
                backgroundColor: colors[sample.name],
                data: statistics(sample.metrics.map(run => (run.uptime)))
            }))
        },
        memoryOnStart: {
            labels: ['Avg', 'Max', 'Min'],
            datasets: state.metrics.map(sample => ({
                label: sample.name,
                backgroundColor: colors[sample.name],
                data: statistics(sample.metrics.map(run => (run.memoryOnStart / 1024)))
            }))
        },
        warmingUp: {
            labels: ['Avg', 'Max', 'Min'],
            datasets: state.metrics.map(sample => ({
                label: sample.name,
                backgroundColor: colors[sample.name],
                data: statistics(sample.metrics.map(run => (run.requestTime[0])))
            }))
        },
        requestTime: {
            labels: ['Avg', 'Max', 'Min'],
            datasets: state.metrics.map(sample => ({
                label: sample.name,
                backgroundColor: colors[sample.name],
                data: statistics(sample.metrics.flatMap(run => (_.tail(run.requestTime))))
            }))
        },
        memoryOnWork: {
            labels: ['Avg', 'Max', 'Min'],
            datasets: state.metrics.map(sample => ({
                label: sample.name,
                backgroundColor: colors[sample.name],
                data: statistics(sample.metrics.flatMap(run => (run.memory)).map(it => (it / 1024)))
            }))
        }
    });
};

export default connect(
    mapStateToProps,
)(Dashboard);
