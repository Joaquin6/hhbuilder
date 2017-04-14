var router = require('express').Router();

router.post('/', function(req, res) {
	res.json({
		message: 'POST Request Recieved'
	});
});

module.exports = router;