/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringStore = require('../stores/MonitoringStore');
import MonitoringActions = require('../actions/MonitoringActions');

import XAxis = require('./XAxis');
import QuotesChart = require('./QuotesChart');
import MACDChart = require('./MACDChart');
import PortfolioChart = require('./PortfolioChart');
import Divider = require('./Divider');
import ChartControls = require('./ChartControls');
import Loading = require('./Loading');

class Chart extends React.Component<{}, Chart.State> {
	
	private static margin = { top: 20, right: 50, bottom: 30, left: 20 };
	
	private svg: SVGElement;
	private xScale = d3.time.scale<Date, number>();
	private zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
	private drag = d3.behavior.drag().origin(() => ({ x: 0, y: this.dividerY }));
	
	private get contentWidth() {
		return this.state.width - Chart.margin.left - Chart.margin.right;
	}
	
	private get contentHeight() {
		return this.state.height - Chart.margin.top - Chart.margin.bottom;
	}
	
	private get dividerY() {
		return Math.round(this.contentHeight * this.state.dividerRatio);
	}
	
	private get chartState() {
		var rect = this.svg && this.svg.getBoundingClientRect();
		return {
			monitoringData: MonitoringStore.data,
			resetXDomain: MonitoringStore.resetXDomain,
			width: rect ? rect.width : 0,
			height: rect ? rect.height : 0
		};
	}
	
	constructor(props) {
		super(props);
		this.state = this.chartState;
		this.state.dividerRatio = 0.7;
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange);
		window.addEventListener('resize', this.onChange);
		this.zoom.on('zoom', this.onZoom);
		this.drag.on('drag', this.onDrag);
		this.onChange();
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
		this.zoom.on('zoom', null);
		this.drag.on('drag', null);
	}
	
	private get chart() {
		if (this.state.monitoringData) {
			
			var margin = Chart.margin,
				width = this.contentWidth,
				height = this.contentHeight,
				quotesHeight = Math.round(height * this.state.dividerRatio),
				macdHeight = Math.min(height - quotesHeight - 100, 300),
				portfolioHeight = height - quotesHeight - macdHeight;
				
			// range() wants Dates which is wrong
			this.xScale.range([0, width] as any);
			
			if (this.state.resetXDomain) {
				this.xScale.domain(this.state.resetXDomain);
				this.zoom.x(this.xScale as any);
			}
			
			return (
				<g transform={'translate(' + margin.left + ', ' + margin.top + ')'}>
					<XAxis
						height={height}
						scale={this.xScale} />
					<QuotesChart
						quotes={this.state.monitoringData.quotes}
						gains={this.state.monitoringData.gains}
						y={0}
						width={width}
						height={quotesHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
					<MACDChart
						macd={this.state.monitoringData.macd}
						y={quotesHeight}
						width={width}
						height={macdHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
					<PortfolioChart
						portfolio={this.state.monitoringData.portfolio}
						y={quotesHeight + macdHeight}
						width={width}
						height={portfolioHeight}
						xScale={this.xScale}
						zoom={this.zoom} />
					<Divider
						y={quotesHeight}
						width={width + margin.right}
						drag={this.drag} />
					<Divider
						y={quotesHeight + macdHeight}
						width={width + margin.right}
						drag={this.drag} />
				</g>
			);
		}
	}
	
	private get controls() {
		if (this.state.monitoringData) {
			return <ChartControls />;
		}
	}
	
	private get loading() {
		if (!this.state.monitoringData) {
			return <Loading />;
		}
	}
	
	render() {
		return (
			<div className='chart'>
				<svg ref={ref => this.svg = ref}>{this.chart}</svg>
				{this.controls}
				{this.loading}
			</div>
		);
	}
	
	private onChange = () => this.setState(this.chartState);
	
	private onZoom = () => {
		var domain = this.xScale.domain();
		if (domain[0]  < this.state.monitoringData.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.state.monitoringData.endDate) {
			MonitoringActions.get(domain[1]);
		}
		this.onChange();
	};
	
	private onDrag = () => {
		var event = d3.event as d3.DragEvent,
			height = this.contentHeight;
		this.setState({ dividerRatio: Math.min(Math.max(event.y / height, 0.1), 0.9) });
	}
}

module Chart {
	export interface State {
		monitoringData?: MonitoringData;
		resetXDomain?: Date[];
		width?: number;
		height?: number;
		dividerRatio?: number;
	}
}

export = Chart;