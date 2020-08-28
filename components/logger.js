const { format, transports, createLogger } = require('winston');
 
const Logger = createLogger({
  level: 'info',
  format: format.combine(format.json(), format.timestamp(), format.colorize()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: './store/errors.log', level: 'error' }),
    new transports.File({ filename: './store/results.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  Logger.add(new transports.Console({
    format: format.combine(format.timestamp(), format.simple()),
  }));
}

module.exports = Logger;
