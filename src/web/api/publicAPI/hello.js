function hello(req, res) {
  const response = {
    message: 'Macron CMS',
    version: 0.1,
  };

  res.json(response);
}

function helloInit(router) {
  router.get('/hello', hello);
}

module.exports = helloInit;
