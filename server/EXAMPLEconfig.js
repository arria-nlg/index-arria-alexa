// These values should be changed based on your local setup.

// The URL your Studio project is deployed at
exports.nlgURL = 'TODO';

// The API key for your Studio project
exports.nlgKey = 'TODO';

// The API key to access Fixer.io
exports.fixerKey = 'TODO';

// Supported currencies
exports.nameMap = {
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
                
exports.symbols = Object.keys(exports.nameMap);