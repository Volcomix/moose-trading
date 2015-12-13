/// <reference path="../../../typings/tsd.d.ts" />
var React = require('react');
var ReactDOM = require('react-dom');
var MonitoringActions = require('./actions/MonitoringActions');
var Chart = require('./components/Chart');
var QuotesChart = require('./components/QuotesChart');
var MACDChart = require('./components/MACDChart');
var MACrossChart = require('./components/MACrossChart');
var BBWChart = require('./components/BBWChart');
var PortfolioChart = require('./components/PortfolioChart');
MonitoringActions.getFirst();
ReactDOM.render((React.createElement(Chart, {"charts": [QuotesChart, MACDChart, MACrossChart, BBWChart, PortfolioChart]})), document.getElementById('react'));
