var router = require('express').Router();

router.route('/houseform')
	.post(function(req, res) {
		var data = req.body;
		var respond = {
			data: data,
			message: 'POST Request Received - Submit'
		};
		console.log(respond);
		res.status(200).json(respond);
	})
	.put(function(req, res) {
		var data = req.body;
		var respond = {
			data: data,
			message: 'PUT Request Received - Add'
		};
		console.log(respond);
		res.status(200).json(respond);
	})
	.delete(function(req, res) {
		var data = req.body;
		var respond = {
			data: data,
			message: 'DELETE Request Received - Delete'
		};
		console.log(respond);
		res.status(200).json(respond);
	});

module.exports = router;