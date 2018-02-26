// These values should be changed based on your local setup.

// The ID of your Alexa Skill
exports.appID = 'amzn1.ask.skill.0d7a9607-c0fe-4818-af5a-eb0cd52c6be2';

// The URL your Studio project is deployed at
exports.nlgURL = 'https://app.studio.arria.com:443/alite_content_generation_webapp/text/OjLZAjplb5X';

// The API key for your Studio project
exports.nlgKey = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJNcS10MDJ0bERLank2QlFsQ1U0amtsZGciLCJpYXQiOjE1MTg5MzE0MTIsImV4cCI6MTY3NjYxMTQxMiwiaXNzIjoiQUxpdGUiLCJzdWIiOiJ6TkI2eWxKcVpxWTMiLCJBTGl0ZS5wZXJtIjpbInByczp4Ok9qTFpBanBsYjVYIl0sIkFMaXRlLnR0IjoidV9hIn0.sVIy8tCvlJwFSxzPFkxCh-0aP8qMTMAHI2rYAcJCONJdP5EGlU74mxGjhZWLXlcrXm7cAfbapAK9V4s3ITRxTw';

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