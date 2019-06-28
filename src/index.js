const config = require('./core/config');
const logger = require('./logger');

logger.setLevel(config.data.project.logger.level);

const core = require('./core');
const io = require('./io');
const cms = require('./cms');
const web = require('./web');
const cli = require('./cli');

logger.info('starting macron CMS');

core.init(config.data.project.channels, config.data.project.alarms);

io.initIO(config.data.project.io);
cms.initCMS(config.data.project);

web.webInit(config.data.project.web);

cli.initCLI(config.data.project.cli);
