var request = require('request-promise');

function sendREST(res, url, type, param){
	var opt = {
		method: type,
		uri: 'http://192.168.56.102:8080'+url,
		json: true,
		body: null
	};

	if (type=='POST' || type=='DELETE') {
		opt.body = param;
	}

	request(opt)
	.then(function( response ){
		res.send(response);
	})
	.catch(function( error ){
		console.log(error);
		//res.send(error);
	});
}

function cleanObject(inp){
	for (var key in inp){
		if (inp[key]===null || inp[key]===undefined) {
			delete inp[key];
		}
	}
	return inp;
}

module.exports = function (app) {
	app.get('/', function(req,res) {
		res.sendFile('public/index.html');
	});

	app.get('/fwstatus', function( req, res ){
		sendREST(res, '/firewall/module/status', 'GET', null);
	});

	app.route('/fwrules/:switchid')
	.get(function( req, res ){
		sendREST(res, '/firewall/rules/' + req.params.switchid + '/all', 'GET', null);
	})
	.post(function( req, res ){
		sendREST(res, '/firewall/rules/' + req.params.switchid, 'POST', cleanObject(req.body));
	});

	app.route('/fwrules/:switchid/:vlanid')
	.post(function( req, res ){
		sendREST(res, '/firewall/rules/' + req.params.switchid + '/' + req.params.vlanid, 'POST', cleanObject(req.body));
	});

	app.delete('/fwrules/:switchid/:ruleid', function( req, res){
		var param = {'rule_id': req.params.ruleid};
		sendREST(res, '/firewall/rules/' + req.params.switchid, 'DELETE', param);
	});

	app.delete('/fwrules/:switchid/:ruleid/:vlanid', function( req, res){
		var param = {'rule_id': req.params.ruleid};
		sendREST(res, '/firewall/rules/' + req.params.switchid + '/' + req.params.vlanid, 'DELETE', param);
	});

	app.get('/fwlog', function( req, res ){
		sendREST(res, '/firewall/log/status', 'GET', null);
	});

	app.put('/fwenable/:switchid', function( req, res ){
		sendREST(res, '/firewall/module/enable/' + req.params.switchid, 'PUT', null);
	});

	app.put('/fwdisable/:switchid', function( req, res ){
		sendREST(res, '/firewall/module/disable/' + req.params.switchid, 'PUT', null);
	});

	app.put('/fwsetlog/:ops/:switchid', function( req, res ){
		sendREST(res, '/firewall/log' + req.params.ops + '/' + req.params.switchid, 'PUT', null);
	});

	app.post('/fwsetlog/:ops/:switchid', function( req, res ){
		sendREST(res, '/firewall/log' + req.params.ops + '/' + req.params.switchid, 'PUT', null);
	});
};
