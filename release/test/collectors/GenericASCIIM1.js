/// <reference path="../../../typings/tsd.d.ts" />
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var moment = require('moment');
var GenericASCIIM1 = require('../../collectors/GenericASCIIM1');
var DummyProcessor = require('../../processors/DummyProcessor');
var DemoCelebrator = require('../../celebrators/DemoCelebrator');
var BinaryOption = require('../../options/BinaryOption');
chai.use(chaiAsPromised);
chai.should();
describe('GenericASCIIM1', function () {
    describe('#collect()', function () {
        var rewards = [{
                countdown: moment({ minutes: 10 }).toDate(),
                expiration: moment({ minutes: 30 }).toDate(),
                payout: 0.75
            }];
        it('should pass quotes to processor', function (done) {
            new GenericASCIIM1({ process: function (quote, rewards) {
                    var dateTime = moment(quote.dateTime);
                    var countdown = moment(reward.countdown);
                    var expiration = moment(reward.expiration);
                    rewards.should.have.length(1);
                    var reward = rewards[0];
                    reward.payout.should.equal(0.75);
                    switch (this.count) {
                        case undefined:
                            dateTime.isSame('2015-06-01 00:03:00-0500').should.be.true;
                            quote.open.should.equal(1.095090);
                            quote.high.should.equal(1.095130);
                            quote.low.should.equal(1.095050);
                            quote.close.should.equal(1.095060);
                            quote.volume.should.equal(0);
                            countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
                            expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                            break;
                        case 1:
                            dateTime.isSame('2015-06-01 00:04:00-0500').should.be.true;
                            quote.open.should.equal(1.095060);
                            quote.high.should.equal(1.095060);
                            quote.low.should.equal(1.095000);
                            quote.close.should.equal(1.095020);
                            quote.volume.should.equal(0);
                            countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
                            expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                            break;
                        case 2:
                            dateTime.isSame('2015-06-01 00:05:00-0500').should.be.true;
                            quote.open.should.equal(1.095020);
                            quote.high.should.equal(1.095120);
                            quote.low.should.equal(1.095020);
                            quote.close.should.equal(1.095080);
                            quote.volume.should.equal(0);
                            countdown.isSame('2015-06-01 00:50:00-0500').should.be.true;
                            expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                            done();
                            break;
                    }
                    this.count = (this.count || 0) + 1;
                    return null;
                } }, { invest: function (option) { } }, new DemoCelebrator(), 'src/test/collectors/GenericASCIIM1.csv', rewards).run();
        });
        it('should pass actions to investor', function (done) {
            new GenericASCIIM1(new DummyProcessor(), { invest: function (option) {
                    var expiration = moment(option.expiration);
                    switch (this.count) {
                        case undefined:
                            expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                            option.amount.should.equal(10);
                            option.direction.should.equal(BinaryOption.Direction.Put);
                            break;
                        case 1:
                            expiration.isSame('2015-06-01 01:00:00-0500').should.be.true;
                            option.amount.should.equal(10);
                            option.direction.should.equal(BinaryOption.Direction.Call);
                            done();
                            break;
                    }
                    this.count = (this.count || 0) + 1;
                } }, new DemoCelebrator(), 'src/test/collectors/GenericASCIIM1.csv', rewards).run();
        });
        it('should reject when input file not found', function () {
            return new GenericASCIIM1({ process: function () { return null; } }, { invest: function () { } }, { getGain: function () { return null; } }, 'dummy', rewards).run().should.be.rejected;
        });
        it('should insert everything into MongoDB');
    });
});
