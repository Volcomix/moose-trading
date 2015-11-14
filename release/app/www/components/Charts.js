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
var MonitoringStore = require('../stores/MonitoringStore');
var QuotesChart = require('./QuotesChart');
var PortfolioChart = require('./PortfolioChart');
var Charts = (function (_super) {
    __extends(Charts, _super);
    function Charts(props) {
        var _this = this;
        _super.call(this, props);
        this.xScale = d3.time.scale();
        this.zoom = d3.behavior.zoom();
        this.onChange = function () { return _this.setState(_this.chartsState); };
        this.onZoom = function () { return setTimeout(function () {
            var domain = _this.xScale.domain();
            if (domain[0] < MonitoringStore.startDate) {
                MonitoringActions.get(domain[0]);
            }
            else if (domain[1] > MonitoringStore.endDate) {
                MonitoringActions.get(domain[1]);
            }
            _this.forceUpdate();
        }, 0); }; // Force wait UI refresh (improve UI performance)
        this.zoom.scaleExtent(this.props.zoomScaleExtent);
        this.state = this.chartsState;
    }
    Object.defineProperty(Charts.prototype, "chartsState", {
        get: function () {
            return {
                loaded: !!MonitoringStore.endDate,
                mainWidth: this.mainContainer && this.mainContainer.offsetWidth,
                quotesChartHeight: this.quotesChartContainer && this.quotesChartContainer.offsetHeight,
                portfolioChartHeight: this.portfolioChartContainer && this.portfolioChartContainer.offsetHeight
            };
        },
        enumerable: true,
        configurable: true
    });
    Charts.prototype.componentDidMount = function () {
        MonitoringStore.addChangeListener(this.onChange);
        window.addEventListener('resize', this.onChange);
        this.onChange();
        this.zoom.on('zoom', this.onZoom);
    };
    Charts.prototype.componentWillUnmount = function () {
        MonitoringStore.removeChangeListener(this.onChange);
        window.removeEventListener('resize', this.onChange);
        this.zoom.on('zoom', null);
    };
    Charts.prototype.render = function () {
        var _this = this;
        if (this.state.loaded) {
            this.updateXScale();
        }
        return (React.createElement("div", {"style": { height: '100%' }, "ref": function (ref) { return _this.mainContainer = ref; }}, React.createElement("div", {"style": { height: '50%' }, "ref": function (ref) { return _this.quotesChartContainer = ref; }}, React.createElement(QuotesChart, {"width": this.state.mainWidth, "height": this.state.quotesChartHeight, "margin": this.props.margin, "xScale": this.xScale, "zoom": this.zoom})), React.createElement("div", {"style": { height: '50%' }, "ref": function (ref) { return _this.portfolioChartContainer = ref; }}, React.createElement(PortfolioChart, {"width": this.state.mainWidth, "height": this.state.portfolioChartHeight, "margin": this.props.margin, "xScale": this.xScale, "zoom": this.zoom}))));
    };
    Charts.prototype.updateXScale = function () {
        var margin = this.props.margin, contentWidth = this.state.mainWidth - margin.left - margin.right, domain = this.xScale.domain();
        this.xScale.range([0, contentWidth]); // range() wants Dates which is wrong
        if (+domain[0] == 0 && +domain[1] == 1) {
            this.initXDomain();
        }
    };
    Charts.prototype.initXDomain = function () {
        var endDateTime = MonitoringStore.endDate, startDateTime = moment(endDateTime).subtract({ hours: 2 }).toDate();
        this.xScale.domain([startDateTime, endDateTime]).nice();
        this.zoom.x(this.xScale);
    };
    return Charts;
})(React.Component);
var Charts;
(function (Charts) {
    Charts.defaultProps = {
        margin: { top: 20, right: 80, bottom: 30, left: 20 },
        zoomScaleExtent: [0.5, 10]
    };
})(Charts || (Charts = {}));
module.exports = Charts;
