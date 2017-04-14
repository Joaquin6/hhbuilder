var router = require('express').Router();

router.post('/houseform/submit', function(req, res) {
	var respond = {
		message: 'POST Request Received - Submit'
	};
	console.log(respond.message);
	res.status(200).json(respond);
});

router.post('/houseform/add', function(req, res) {
	var respond = {
		message: 'POST Request Received - Add'
	};
	console.log(respond.message);
	res.status(200).json(respond);
});

module.exports = router;