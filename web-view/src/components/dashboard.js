import React, {useState} from "react";
import {connect} from 'react-redux';
import _ from 'lodash';
import {Card} from "primereact/card";
import {ScrollPanel} from "primereact/scrollpanel";
import {SelectButton} from "primereact/selectbutton";
import ChartCard from "./chart-card";
import {AutoComplete} from "primereact/autocomplete";
import {ListBox} from "primereact/listbox";
import {Button} from "primereact/button";
import randomColor from 'randomcolor';
import TagsCard from "./tags-card";

const Dashboard = (props) => {
    const [chartType, setChartType] = useState("bar");
    const [tags, setTags] = useState(null);
    const [samples, setSamples] = useState(props.samples);
    const [tagsSuggestions, setTagsSuggestions] = useState(null);
    const types = [
        {label: 'Vertical Bar', value: 'bar'},
        {label: 'Horizontal Bar', value: 'horizontalBar'},
    ];

    const filterTags = (event) => {
        setTimeout(() => {
            const results = props.tags.filter(tag => (tag.toLowerCase().indexOf(event.query.toLowerCase()) >= 0));
            setTagsSuggestions(results)
        }, 250);
    };

    const renderListItem = (item) => {
        const classes = !!samples.find((it) => it.name === item.name) ?
            "mdi mdi-checkbox-marked-outline mdi-18" : "mdi mdi-checkbox-blank-outline mdi-18";
        return (<span><i className={classes} style={{paddingRight: '5px'}}/>{item.name}</span>);
    };

    const selectTags = (e) => {
        const tags = e.value;
        setTags(tags);
        if (tags.length > 0) {
            setSamples(props.samples.filter((it) => _.intersection(it.tags, tags).length > 0));
        }
    };

    return (
        <div className="p-grid">
            <div className="p-sm-12 p-md-12 p-lg-4 p-xl-3" style={{paddingTop: '5em'}}>
                <div className="p-grid p-justify-around">
                    <Card style={{width: '280px'}}>
                        <div className="p-grid p-dir-col">
                            <div className="p-col">
                                <SelectButton value={chartType} options={types}
                                              onChange={(e) => setChartType(e.value)}/>
                            </div>
                            <div className="p-col">
                                <AutoComplete value={tags} suggestions={tagsSuggestions} completeMethod={filterTags}
                                              minLength={1} placeholder="Tags" multiple={true} className="tags-search"
                                              onChange={selectTags}/>
                            </div>
                            <div className="p-col">
                                <ListBox value={samples} options={props.samples} className="samples-list"
                                         onChange={(e) => setSamples(e.value)}
                                         filter={true} multiple={true} optionLabel="name"
                                         itemTemplate={renderListItem}
                                />

                                <div className="p-grid app-tools">
                                    <div className="p-col">
                                        <Button label="Select All" className="p-button-raised p-button-secondary"
                                                onClick={() => setSamples(props.samples)}
                                        />
                                    </div>
                                    <div className="p-col">
                                        <Button label="Clear All" className="p-button-raised p-button-secondary"
                                                onClick={() => setSamples([])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <TagsCard samples={props.samples}/>
                </div>
            </div>
            <div className="p-sm-12 p-md-12 p-lg-8 p-xl-6">
                <ScrollPanel style={{width: '100%', height: 'calc(100vh - 5.1em)', paddingTop: '4.6em'}}>
                    <ChartCard title="Memory on start (Mb)" chartType={chartType} data={props.memoryOnStart}
                               first={true} samples={samples}/>

                    <ChartCard title="Working memory (Mb)" chartType={chartType} data={props.memoryOnWork}
                               samples={samples}/>

                    <ChartCard title="Uptime (ms)" chartType={chartType} data={props.uptime}
                               samples={samples}/>

                    <ChartCard title="Warming up (ms)" chartType={chartType} data={props.warmingUp}
                               samples={samples}/>

                    <ChartCard title="Request time (ms)" chartType={chartType} data={props.requestTime}
                               samples={samples}/>
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
        state.metrics.map(() => (randomColor()))
    );

    return ({
        samples: state.metrics.map(sample => ({name: sample.name, tags: sample.tags})),
        tags: _.uniq(_.flatMap(state.metrics.map(sample => (sample.tags)))),
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
                data: statistics(sample.metrics.map(run => (
                    run.requestTime[0] - avg(_.tail(run.requestTime))
                )))
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
