/// <reference path="../../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var moment = require('moment');
var MonitoringActions = require('../actions/MonitoringActions');
var XAxis = require('./XAxis');
var YAxis = require('./YAxis');
var LineSeries = require('./LineSeries');
var Cursor = require('./Cursor');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        var _this = this;
        _super.apply(this, arguments);
        this.yScale = d3.scale.linear();
        this.onZoom = function () { return setTimeout(function () {
            var data = _this.props.data, domain = _this.props.xScale.domain();
            if (domain[0] < _this.props.xAccessor(data[0])) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > _this.props.xAccessor(data[data.length - 1])) {
                MonitoringActions.get(domain[1]);
            }
            _this.props.onZoom();
        }, 0); }; // Force wait UI refresh (improve UI performance)
    }
    Chart.prototype.render = function () {
        if (!this.props.data)
            return React.createElement("span", null, "Loading data...");
        var margin = this.props.margin, contentWidth = this.props.width - margin.left - margin.right, contentHeight = this.props.height - margin.top - margin.bottom;
        this.updateXScale(contentWidth);
        this.updateYScale(contentHeight);
        return (React.createElement("svg", {"width": this.props.width, "height": this.props.height}, React.createElement("g", {"transform": 'translate(' + margin.left + ', ' + margin.top + ')'}, React.createElement('clipPath', { id: 'clip' }, React.createElement("rect", {"width": contentWidth, "height": contentHeight})) /* TSX doesn't know clipPath element */, React.createElement(XAxis, {"height": contentHeight, "scale": this.props.xScale}), React.createElement(YAxis, {"width": contentWidth, "scale": this.yScale}), React.createElement(LineSeries, {"data": this.props.data, "xAccessor": this.props.xAccessor, "yAccessor": this.props.yAccessor, "xScale": this.props.xScale, "yScale": this.yScale, "clipPath": 'url(#clip)'}), React.createElement(Cursor, {"data": this.props.data, "xAccessor": this.props.xAccessor, "width": contentWidth, "height": contentHeight, "xScale": this.props.xScale, "yScale": this.yScale, "onZoom": this.onZoom}))));
    };
    Chart.prototype.updateXScale = function (width) {
        var domain = this.props.xScale.domain();
        this.props.xScale.range([0, width]); // range() wants Dates which is wrong
        if (+domain[0] == 0 && +domain[1] == 1) {
            var lastDatum = this.props.data[this.props.data.length - 1];
            var endDateTime = this.props.xAccessor(lastDatum);
            var startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
            this.props.xScale.domain([startDateTime, endDateTime]).nice();
        }
    };
    Chart.prototype.updateYScale = function (height) {
        var bisect = d3.bisector(this.props.xAccessor).left, domain = this.props.xScale.domain(), i = bisect(this.props.data, domain[0], 1), j = bisect(this.props.data, domain[1], i + 1), domainData = this.props.data.slice(i - 1, j + 1), extent = d3.extent(domainData, this.props.yAccessor);
        this.yScale.range([height, 0]);
        if (extent[0] != extent[1]) {
            var padding = this.props.yDomainPadding * (extent[1] - extent[0]);
            this.yScale.domain([extent[0] - padding, extent[1] + padding]).nice();
        }
    };
    return Chart;
})(React.Component);
var Chart;
(function (Chart) {
    Chart.defaultProps = {
        data: undefined,
        xAccessor: undefined,
        yAccessor: undefined,
        width: undefined,
        height: undefined,
        xScale: undefined,
        margin: { top: 20, right: 80, bottom: 30, left: 20 },
        yDomainPadding: 0.05
    };
})(Chart || (Chart = {}));
module.exports = Chart;
