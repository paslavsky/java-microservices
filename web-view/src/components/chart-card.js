import React from 'react';
import {Card} from "primereact/card";
import {Chart} from "primereact/chart";
import * as PropTypes from "prop-types";
import _ from 'lodash'

class ChartCard extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        this.changeType = false;
        if (this.props.chartType !== nextProps.chartType) {
            this.changeType = true;
            return true;
        }
        return !_.isEqual(this.props, nextProps);
    }

    setChartRef(c) {
        if (!!this.changeType && c)
            c.reinit();
        this.chart = c;
        this.changeType = false;
    }

    render() {
        const {first, title, chartType, data, samples} = this.props;
        const filter = (data, samples) => {
            data = _.clone(data);
            data.datasets = data.datasets.filter((it) => _.find(samples, (s) => s.name === it.label));
            return data;
        };

        return (
            <Card title={title} style={{marginTop: !first ? '3em' : '0'}}>
                <Chart type={chartType || "bar"} data={filter(data, samples)} ref={this.setChartRef.bind(this)}/>
            </Card>
        );
    }
}

ChartCard.propTypes = {
    first: PropTypes.bool,
    title: PropTypes.string,
    chartType: PropTypes.oneOf(["bar", "horizontalBar"]),
    data: PropTypes.object,
    samples: PropTypes.array
};

export default ChartCard;
