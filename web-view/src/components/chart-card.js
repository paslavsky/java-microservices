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
        } else if (!_.isEqual(this.props.data, nextProps.data)) {
            this.chart.refresh();
            return true;
        }
        return !_.isEqual(this.props, nextProps);
    }

    setChartRef(c) {
        if (!!this.changeType && !!c)
            c.reinit();
        this.chart = c;
    }

    render() {
        const {first, title, chartType, data} = this.props;

        return (
            <Card title={title} style={{marginTop: !first ? '3em' : '0'}}>
                <Chart type={chartType || "bar"} data={data} ref={this.setChartRef.bind(this)}/>
            </Card>
        );
    }
}

ChartCard.propTypes = {
    first: PropTypes.bool,
    title: PropTypes.string,
    chartType: PropTypes.oneOf(["bar", "horizontalBar"]),
    data: PropTypes.object
};

export default ChartCard;
