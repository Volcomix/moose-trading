/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var d3 = require('d3');
var XCursor = (function (_super) {
    __extends(XCursor, _super);
    function XCursor() {
        _super.apply(this, arguments);
        this.bisectDate = d3.bisector(function (d) { return d.dateTime; }).left;
        this.dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
    }
    XCursor.prototype.render = function () {
        var x0 = this.props.scale.invert(this.props.x), i = this.bisectDate(this.props.data, x0, 1), d0 = this.props.data[i - 1], d1 = this.props.data[i], d;
        if (d1) {
            d = +x0 - +d0.dateTime > +d1.dateTime - +x0 ? d1 : d0;
        }
        else {
            d = d0;
        }
        return (React.createElement("g", {"className": 'x cursor', "transform": 'translate(' + this.props.scale(d.dateTime) + ', 0)'}, React.createElement("line", {"y2": this.props.height}), React.createElement("rect", {x: -60, y: this.props.height, "width": 120, "height": 14}), React.createElement("text", {"dy": '.71em', y: this.props.height + 3}, this.dateFormat(d.dateTime))));
    };
    return XCursor;
})(React.Component);
module.exports = XCursor;
