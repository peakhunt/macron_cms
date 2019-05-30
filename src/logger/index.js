const { createLogger, format, transports } = require('winston');

const {
  combine,
  timestamp,
  printf,
} = format;

// const level = process.env.NODE_ENV === 'dev' ? 'warn' : 'info';
const level = 'error';

const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console({ level }),
    new transports.File({
      filename: 'macron_cms.log',
      level,
      maxsize: 1048576,
    }),
  ],
});

logger.setLevel = (lvl) => {
  logger.transports[0].level = lvl;
  logger.transports[1].level = lvl;
};

logger.getLevel = () => logger.transports[1].level;

module.exports = logger;
