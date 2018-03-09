const config = require('./config');
const request = require('request-promise'); // To handle REST requests
const moment = require('moment'); // To handle dates

exports.requests = {
    getTodaysData : function(currency){
        return request({
            url: 'https://data.fixer.io/api/latest?base=' + currency + '&symbols=' + config.symbols + '&access_key=' + config.fixerKey,
            transform: function (body) {
                if(JSON.parse(body).success){                    
                    return JSON.parse(body).rates;
                } else {
                    throw new Error('Could not access the fixer.io service.');
                }
            }
        });
    },
    addYesterdaysData : function(currency, todayData){
        var date = moment().subtract(1, 'days').format('YYYY-MM-DD');
        return request({
            url: 'https://data.fixer.io/api/' + date + '?base=' + currency + '&symbols=' + config.symbols + '&access_key=' + config.fixerKey,
            transform: function (body) {
                if(JSON.parse(body).success){                                
                    return {
                        today: todayData,
                        yesterday: JSON.parse(body).rates
                    };
                } else {
                    throw new Error('Could not access the fixer.io service.');
                }
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
            uri: config.nlgURL,
            body: JSON.stringify(wrappedData),
            headers: {
                authorization: 'Bearer ' + config.nlgKey,
                'content-type': 'application/json'
            },
            transform: function (body) {
                if(body){
                    return JSON.parse(body)[0].result;
                } else {
                    throw new Error("Could not access the NLG Studio API.");
                }
            }
        });    
    }
}

exports.analysis = {
    collateData : function(reportCurrency, originalData){
        var collatedData = {
            currency: reportCurrency,
            shortName: config.nameMap[reportCurrency].shortName,
            fullName: config.nameMap[reportCurrency].fullName,
            comparisons: []
        };
        Object.keys(config.nameMap).forEach(function(currentCurrency, index) {
            if(currentCurrency != reportCurrency){
                collatedData.comparisons.push({
                    today: originalData.today[currentCurrency],
                    yesterday: originalData.yesterday[currentCurrency],
                    currency: currentCurrency,
                    shortName: config.nameMap[currentCurrency].shortName,
                    fullName: config.nameMap[currentCurrency].fullName
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
            comparison.changePercentage = comparison.change * 100.0 / comparison.yesterday;
            totalChangePercentage += comparison.changePercentage;
        }
        
        data.averageChangePercentage = totalChangePercentage / data.comparisons.length;
        
        return data;
    }
}
