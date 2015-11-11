/// <reference path="../../../../typings/tsd.d.ts" />

import React = require('react');

import QuotesChart = require('./QuotesChart');
import PortfolioChart = require('./PortfolioChart');

class Charts extends React.Component<Charts.Props, Charts.State> {
	
	private mainContainer: HTMLDivElement;
	private quotesChartContainer: HTMLDivElement;
	private portfolioChartContainer: HTMLDivElement;
	
	constructor(props) {
		super(props);
		this.state = {
			mainWidth: undefined,
			quotesChartHeight: undefined,
			portfolioChartHeight: undefined
		};
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.onResize);
		this.onResize();
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	}
	
	render() {
		return (
			<div
				style={{ height: '100%' }}
				ref={(ref: any) => this.mainContainer = ref}>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.quotesChartContainer = ref}>
					<QuotesChart
						width={this.state.mainWidth}
						height={this.state.quotesChartHeight} />
				</div>
				<div
					style={{ height: '50%' }}
					ref={(ref: any) => this.portfolioChartContainer = ref}>
					<PortfolioChart
						width={this.state.mainWidth}
						height={this.state.portfolioChartHeight} />
				</div>
			</div>
		);
	}
	
	private onResize = () => this.setState({
		mainWidth: this.mainContainer.offsetWidth,
		quotesChartHeight: this.quotesChartContainer.offsetHeight,
		portfolioChartHeight: this.portfolioChartContainer.offsetHeight
	})
}

module Charts {
	export interface Props {
	}
	
	export interface State {
		mainWidth: number;
		quotesChartHeight: number;
		portfolioChartHeight: number;
	}
}

export = Charts;