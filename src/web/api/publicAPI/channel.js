const core = require('../../../core');

function getChannelStatus(req, res) {
  const channelId = parseInt(req.params.channelId, 10);
  const channel = core.getChannel(channelId);

  if (channel === undefined) {
    res.status(422).send();
    return;
  }

  res.json(channel.getStatus());
}

function channelInit(router) {
  router.get('/channel/:channelId', getChannelStatus);
}

module.exports = channelInit;
