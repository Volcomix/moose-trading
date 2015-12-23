/// <reference path="../../../typings/tsd.d.ts" />
var express = require('express');
var Q = require('q');
var moment = require('moment');
var QuotesService = require('./services/QuotesService');
var MACDService = require('./services/MACDService');
var MACrossService = require('./services/MACrossService');
var BollingerService = require('./services/BollingerService');
var PortfolioService = require('./services/PortfolioService');
var GainsService = require('./services/GainsService');
var OptionsService = require('./services/OptionsService');
var router = express.Router();
router.get('/minutes/first', function (req, res, next) {
    var firstDate;
    Q.all([
        QuotesService.getFirstDate(),
        PortfolioService.getFirstDate(),
        GainsService.getFirstDate()])
        .then(function (results) {
        firstDate = moment.min.apply(moment, results
            .filter(function (result) { return !!result[0]; })
            .map(function (result) { return moment(result[0].dateTime); }));
        return getByMinute(firstDate);
    })
        .then(function (data) {
        data.startDate = firstDate.toDate();
        res.send(data);
    });
});
router.get('/minutes/last', function (req, res, next) {
    var lastDate;
    Q.all([
        QuotesService.getLastDate(),
        PortfolioService.getLastDate(),
        GainsService.getLastDate()])
        .then(function (results) {
        lastDate = moment.max.apply(moment, results
            .filter(function (result) { return !!result[0]; })
            .map(function (result) { return moment(result[0] && result[0].dateTime); }));
        return getByMinute(lastDate);
    })
        .then(function (data) {
        data.endDate = lastDate.toDate();
        res.send(data);
    });
});
router.get('/minutes/:dateTime', function (req, res, next) {
    getByMinute(moment(req.params.dateTime)).then(function (data) { return res.send(data); });
});
router.get('/previous/option/:dateTime', function (req, res, next) {
    OptionsService.getPrevious(new Date(req.params.dateTime))
        .then(function (result) {
        if (result.length)
            return getByMinute(moment(result[0].dateTime));
    })
        .then(function (data) {
        if (data)
            res.send(data);
        else
            res.sendStatus(404);
    });
});
router.get('/next/option/:dateTime', function (req, res, next) {
    OptionsService.getNext(new Date(req.params.dateTime))
        .then(function (result) {
        if (result.length)
            return getByMinute(moment(result[0].dateTime));
    })
        .then(function (data) {
        if (data)
            res.send(data);
        else
            res.sendStatus(404);
    });
});
function getByMinute(dateTime) {
    var roundedDateTime = dateTime.clone(); // Next operations mutates Moment object
    if (roundedDateTime.hour() < 6) {
        roundedDateTime.startOf('day');
    }
    else if (roundedDateTime.hour() >= 18) {
        roundedDateTime.add({ days: 1 }).startOf('day');
    }
    else {
        roundedDateTime.hour(12).startOf('hour');
    }
    var startDate = moment(roundedDateTime).subtract({ hours: 12 }).toDate(), endDate = moment(roundedDateTime).add({ hours: 11, minutes: 59 }).toDate();
    return Q.all([
        QuotesService.get(startDate, endDate),
        PortfolioService.get(startDate, endDate),
        GainsService.get(startDate, endDate)
    ])
        .spread(function (quotes, portfolio, gains) { return ({
        startDate: startDate,
        endDate: endDate,
        quotes: quotes,
        macd: MACDService.get(quotes, 12, 26, 9),
        maCross: MACrossService.get(quotes, 9, 21),
        bband: BollingerService.get(quotes, 20, 2),
        portfolio: portfolio,
        gains: gains
    }); });
}
module.exports = router;
