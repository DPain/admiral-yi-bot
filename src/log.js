const bunyan = require('bunyan');

// Create the main logger
const log = bunyan.createLogger({
  name: 'Admiral Yi Bot',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: 'error.log'
    }
  ]
});

module.exports = log;