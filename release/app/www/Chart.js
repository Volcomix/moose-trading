/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var d3 = require('d3');
var React = require('react');
var TimeFormat = require('./TimeFormat');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart() {
        _super.apply(this, arguments);
        this.x = d3.time.scale();
        this.y = d3.scale.linear();
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .tickFormat(TimeFormat.multi())
            .orient('bottom');
        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .tickFormat(d3.format(',.5f'))
            .orient('right');
    }
    Chart.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, marginTop = _a.marginTop, marginRight = _a.marginRight, marginBottom = _a.marginBottom, marginLeft = _a.marginLeft;
        var innerWidth = width - marginLeft - marginRight;
        var innerHeight = height - marginTop - marginBottom;
        this.x.range([0, innerWidth]);
        this.y.range([innerHeight, 0]);
        this.xAxis.tickSize(-innerHeight, 0);
        this.yAxis.tickSize(-innerWidth, 0);
        return (React.createElement("svg", {"width": width, "height": height}, React.createElement("g", {"transform": 'translate(' + marginLeft + ', ' + marginTop + ')'}, React.createElement("g", {"className": 'x axis', "transform": 'translate(0, ' + innerHeight + ')', "ref": function (ref) { return d3.select(ref).call(_this.xAxis); }}), React.createElement("g", {"className": 'y axis', "transform": 'translate(' + innerWidth + ', 0)', "ref": function (ref) { return d3.select(ref).call(_this.yAxis); }}), this.props.children)));
    };
    return Chart;
})(React.Component);
var Chart;
(function (Chart) {
    Chart.defaultProps = {
        marginTop: 20,
        marginRight: 50,
        marginBottom: 30,
        marginLeft: 20
    };
})(Chart || (Chart = {}));
module.exports = Chart;
