const Alexa = require('alexa-sdk'); // To interface with Alexa
const request = require('request-promise'); // To handle REST requests
const moment = require('moment'); // To handle dates

//To configure
const appID = 'amzn1.ask.skill.0d7a9607-c0fe-4818-af5a-eb0cd52c6be2';
const nlgURL = 'https://app.studio.arria.com:443/alite_content_generation_webapp/text/OjLZAjplb5X';
const nlgKey = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJNcS10MDJ0bERLank2QlFsQ1U0amtsZGciLCJpYXQiOjE1MTg5MzE0MTIsImV4cCI6MTY3NjYxMTQxMiwiaXNzIjoiQUxpdGUiLCJzdWIiOiJ6TkI2eWxKcVpxWTMiLCJBTGl0ZS5wZXJtIjpbInByczp4Ok9qTFpBanBsYjVYIl0sIkFMaXRlLnR0IjoidV9hIn0.sVIy8tCvlJwFSxzPFkxCh-0aP8qMTMAHI2rYAcJCONJdP5EGlU74mxGjhZWLXlcrXm7cAfbapAK9V4s3ITRxTw';

// Supported currencies
const nameMap = {
                    USD : {
                        fullName : 'US Dollar',
                        shortName : 'Dollar'
                    },
                    GBP : {
                        fullName : 'British Pound',
                        shortName : 'Pound'
                    },
                    JPY : {
                        fullName : 'Japanese Yen',
                        shortName : 'Yen'
                    },
                    EUR : {
                        fullName : 'Euro',
                        shortName : 'Euro'
                    }
                };
                
const symbols = Object.keys(nameMap);


var requests = {
    getTodaysData : function(currency){
        return request({
            url: 'https://api.fixer.io/latest?base=' + currency + '&symbols=' + symbols,
            transform: function (body) {
                return JSON.parse(body).rates;
            }
        });
    },
    addYesterdaysData : function(currency, todayData){
        var date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        return request({
            url: 'https://api.fixer.io/' + date + '?base=' + currency + '&symbols=' + symbols,
            transform: function (body) {
                return {
                    today: todayData,
                    yesterday: JSON.parse(body).rates
                };
            }
        });
    },
    generateNarrative : function(data){
        var wrappedData = {
            data: [{
                id: "Primary",
                type: "json",
                jsonData: data
            }]
        };
        
        console.log(JSON.stringify(wrappedData));
        
        return request({
            method: 'POST',
            uri: nlgURL,
            body: JSON.stringify(wrappedData),
            headers: {
                authorization: 'Bearer ' + nlgKey,
                'content-type': 'application/json'
            },
            transform: function (body) {
                console.log(body);
                return JSON.parse(body)[0].result;
            }
        });    
    }
}

var analysis = {
    collateData : function(reportCurrency, originalData){
        var collatedData = {
            currency: reportCurrency,
            shortName: nameMap[reportCurrency].shortName,
            fullName: nameMap[reportCurrency].fullName,
            comparisons: []
        };
        Object.keys(nameMap).forEach(function(currentCurrency, index) {
            if(currentCurrency != reportCurrency){
                collatedData.comparisons.push({
                    today: originalData.today[currentCurrency],
                    yesterday: originalData.yesterday[currentCurrency],
                    currency: currentCurrency,
                    shortName: nameMap[currentCurrency].shortName,
                    fullName: nameMap[currentCurrency].fullName
                });
            }
            
        });
        return collatedData;
    },
    analyseVariance : function(data){
        var totalChangePercentage = 0;
        
        for(var index in data.comparisons){
            var comparison = data.comparisons[index];
            comparison.change = comparison.today - comparison.yesterday;
            comparison.changePercentage = comparison.change / comparison.yesterday;
            totalChangePercentage += comparison.changePercentage;
        }
        
        data.averageChangePercentage = totalChangePercentage * 100.0 / data.comparisons.length;
        
        return data;
    }
}



const handlers = {
    'CurrencyDescriptionIntent' : function(){
        if(this.event.request.intent.slots.currency.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH'){
            this.emit(':tell', "I'm sorry, I don't know what currency " + this.event.request.intent.slots.currency.value + " are. Please try again.");
        } else {
            var reportCurrency = this.event.request.intent.slots.currency.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            console.log('Generating a report for ' + reportCurrency);

            requests.getTodaysData(reportCurrency)
            .then(todaysData => requests.addYesterdaysData(reportCurrency, todaysData))
            .then(combinedData => analysis.collateData(reportCurrency, combinedData))
            .then(data => analysis.analyseVariance(data))
            .then(data => requests.generateNarrative(data))
            .then(response => {
                this.emit(':tell', response);
            })
            .catch(error => {
                console.log(error);
                return 'Exchange rate data is not available at this time. Please try again later.';
            });
        }
    }
};
    
exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = appID;
    alexa.registerHandlers(handlers);
    alexa.execute();        
};