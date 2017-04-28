'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};


module.exports = function(app) {
	var router = app.loopback.Router();
  
	app.get('/productMetadata', function(req, res) {
		res.send('pong');
	});
	
	app.use(router);
}