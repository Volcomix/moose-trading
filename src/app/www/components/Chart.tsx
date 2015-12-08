/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');
import d3 = require('d3');

import MonitoringData = require('../../../documents/MonitoringData');

import MonitoringStore = require('../stores/MonitoringStore');
import MonitoringActions = require('../actions/MonitoringActions');
import Margin = require('./common/Margin');

import ChartRows = require('./ChartRows');
import XAxis = require('./XAxis');
import QuotesChart = require('./QuotesChart');
import MACDChart = require('./MACDChart');
import PortfolioChart = require('./PortfolioChart');
import Divider = require('./Divider');
import ChartControls = require('./ChartControls');
import Loading = require('./Loading');

class Chart extends React.Component<{}, Chart.State> {
	
	private static margin: Margin = { top: 20, right: 50, bottom: 30, left: 20 };
	
	private svg: SVGElement;
	private xScale = d3.time.scale<Date, number>();
	private zoom = d3.behavior.zoom().scaleExtent([0.5, 10]);
	
	private get contentWidth() {
		return this.state.width - Chart.margin.left - Chart.margin.right;
	}
	
	private get contentHeight() {
		return this.state.height - Chart.margin.top - Chart.margin.bottom;
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
		this.state.dividers = [0.4, 0.75];
	}
	
	componentDidMount() {
		MonitoringStore.addChangeListener(this.onChange);
		window.addEventListener('resize', this.onChange);
		this.zoom.on('zoom', this.onZoom);
		this.onChange();
	}
	
	componentWillUnmount() {
		MonitoringStore.removeChangeListener(this.onChange);
		window.removeEventListener('resize', this.onChange);
		this.zoom.on('zoom', null);
	}
	
	private get chart() {
		if (this.state.monitoringData) {
			
			var width = this.contentWidth,
				height = this.contentHeight,
				dividersRatio = this.state.dividers,
				quotesHeight = Math.round(height * dividersRatio[0]),
				macdHeight = Math.round(height * dividersRatio[1] - quotesHeight),
				portfolioHeight = height - quotesHeight - macdHeight;
				
			// range() wants Dates which is wrong
			this.xScale.range([0, width] as any);
			
			if (this.state.resetXDomain) {
				this.xScale.domain(this.state.resetXDomain);
				this.zoom.x(this.xScale as any);
			}
			
			return (
				<ChartRows
					width={width}
					height={height}
					margin={Chart.margin}
					dividers={this.state.dividers}
					onDividerDrag={this.onDividerDrag}>
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
				</ChartRows>
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
	private onDividerDrag = (dividers: number[]) => this.setState({ dividers });
	
	private onZoom = () => {
		var domain = this.xScale.domain();
		if (domain[0]  < this.state.monitoringData.startDate) {
			MonitoringActions.get(domain[0]);
		} else if (domain[1] > this.state.monitoringData.endDate) {
			MonitoringActions.get(domain[1]);
		}
		this.onChange();
	};
}

module Chart {
	export interface State {
		monitoringData?: MonitoringData;
		resetXDomain?: Date[];
		width?: number;
		height?: number;
		dividers?: number[];
	}
}

export = Chart;