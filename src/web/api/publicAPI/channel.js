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

function getChannelStatusRange(req, res) {
  const start = parseInt(req.params.start, 10);
  const end = parseInt(req.params.end, 10);
  const list = core.channel.getChannelRange(start, end);
  const ret = {};

  list.forEach((chnl) => {
    ret[chnl.number] = chnl.getStatus();
  });

  res.json(ret);
}

function channelInit(router) {
  router.get('/channel/:channelId', getChannelStatus);
  router.get('/channelRange/:start/:end', getChannelStatusRange);
}

module.exports = channelInit;
