const config = require('./core/config');
const logger = require('./logger');
const core = require('./core');
const io = require('./io');
const cms = require('./cms');
const cli = require('./cli');

logger.info('starting macron CMS');

core.init(config.data.project.channels, config.data.project.alarms);
io.initIO(config.data.project.io);
cms.initCMS(config.data.project);

cli.initCLI();
