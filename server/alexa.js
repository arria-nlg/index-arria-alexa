const config = require('./config');
const logic = require('./logic');
const Alexa = require('alexa-sdk'); // To interface with Alexa

const handlers = {
    'CurrencyDescriptionIntent' : function(){
        const currencySlot = this.event.request.intent.slots.currency;
        if(currencySlot.resolutions == undefined){
            this.emit(':tell', "I need to know what currency you are interested in. Please try again.");

        } else if(currencySlot.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH'){
            this.emit(':tell', "I'm sorry, I don't know what currency " + currencySlot.value + " are. Please try again.");

        } else {
            var reportCurrency = currencySlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            console.log('Generating a report for ' + reportCurrency);

            logic.requests.getTodaysData(reportCurrency)
            .then(todaysData => logic.requests.addYesterdaysData(reportCurrency, todaysData))
            .then(combinedData => logic.analysis.collateData(reportCurrency, combinedData))
            .then(data => logic.analysis.analyseVariance(data))
            .then(data => logic.requests.generateNarrative(data))
            .then(response => {
                this.emit(':tell', response);
            })
            .catch(error => {
                console.log(error);
                this.emit(':tell', 'Exchange rate data is not available at this time. Please try again later.');
            });
        }
    }
};
    
exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();        
};