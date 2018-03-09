const config = require('./config');
const logic = require('./logic');
const express = require('express');
const request = require('request-promise');

// Router
const router = express.Router();

handleError = function(res, error) {
    console.error(error.message);
    res.status(500);
    res.send(error.message);
}

// Get only the data for a particular currency
router.get('/data/:currency', function (req, res, next) {
    const reportCurrency = req.params.currency;
    console.log('Getting data for ' + reportCurrency);
        
    logic.requests.getTodaysData(reportCurrency)
    .then(todaysData => logic.requests.addYesterdaysData(reportCurrency, todaysData))
    .then(combinedData => logic.analysis.collateData(reportCurrency, combinedData))
    .then(data => res.send(data))
    .catch(error => handleError(res, error));
});

// Get analysed data for a particular currency, including variance and percentage variance
router.get('/analysis/:currency', function (req, res, next) {
    const reportCurrency = req.params.currency;
    console.log('Analysing data for ' + reportCurrency);
        
    logic.requests.getTodaysData(reportCurrency)
    .then(todaysData => logic.requests.addYesterdaysData(reportCurrency, todaysData))
    .then(combinedData => logic.analysis.collateData(reportCurrency, combinedData))
    .then(data => logic.analysis.analyseVariance(data))
    .then(data => res.send(data))
    .catch(error => handleError(res, error));
});

// Get a narrative for a particular currency
router.get('/narrative/:currency', function (req, res, next) {
    const reportCurrency = req.params.currency;
    console.log('Getting a narrative for ' + reportCurrency);
        
    logic.requests.getTodaysData(reportCurrency)
    .then(todaysData => logic.requests.addYesterdaysData(reportCurrency, todaysData))
    .then(combinedData => logic.analysis.collateData(reportCurrency, combinedData))
    .then(data => logic.analysis.analyseVariance(data))
    .then(data => logic.requests.generateNarrative(data))
    .then(data => res.send(data))
    .catch(error => handleError(res, error));
});

// Export
module.exports = router;
