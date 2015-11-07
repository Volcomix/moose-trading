/// <reference path="../../../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');

import Quote = require('../../documents/Quote');

import Chart = require('./components/Chart');

var asQuote = (dateTime: Date, close: number): Quote => ({
	dateTime: dateTime,
	open: undefined,
	high: undefined,
	low: undefined,
	close: close,
	volume: undefined,
	rewards: undefined
})

var data = [
	asQuote(new Date('2015-10-20T10:00:00Z'), 1.12),
	asQuote(new Date('2015-10-20T11:00:00Z'), 1.20),
	asQuote(new Date('2015-10-20T12:00:00Z'), 1.16),
	asQuote(new Date('2015-10-20T13:00:00Z'), 1.35)
];
ReactDOM.render(<Chart data={data} />, document.getElementById('chart'));