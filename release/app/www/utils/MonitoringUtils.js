/// <reference path="../../../../typings/tsd.d.ts" />
var Q = require('q');
var d3 = require('d3');
var MonitoringServerActions = require('../actions/MonitoringServerActions');
function convertDateTime(d) {
    d.dateTime = new Date(d.dateTime);
}
function receive(data) {
    // Datetimes are received from server as strings
    data.quotes.forEach(convertDateTime);
    data.portfolio.forEach(convertDateTime);
    MonitoringServerActions.receive(data);
}
var delay = Q(null);
var retrieveDateTime;
function retrieveData() {
    if (retrieveDateTime) {
        delay = Q.delay(1000).then(retrieveData);
        Q.nfcall(d3.json, '/monitoring/' + retrieveDateTime.toISOString())
            .then(receive);
        retrieveDateTime = undefined;
    }
}
function get(dateTime) {
    retrieveDateTime = dateTime;
    if (!delay.isPending()) {
        retrieveData();
    }
}
exports.get = get;
function getLast() {
    Q.nfcall(d3.json, '/monitoring').then(receive);
}
exports.getLast = getLast;
