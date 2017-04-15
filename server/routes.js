var router = require('express').Router();
var uniqueId = 1;
var householdData = {
	updated: null,
	list: [],
	count: {
		total: 0,
		children: 0,
		parents: 0,
		grandparents: 0,
		spouses: 0,
		self: 0,
		other: 0
	}
};

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
	.get(function(req, res) {
		var respond = {
			data: householdData,
			message: 'GET Request Received - Get'
		};
		console.log(respond);
		res.status(200).json(respond);
	})
	.put(function(req, res) {
		var person = req.body;
		person.id = getUniqueId();

		incrementDataCount(person);

		var respond = {
			added: person,
			message: 'PUT Request Received - Add'
		};
		console.log(respond);

		updateDataTimestamp();
		respond.data = householdData;
		res.status(200).json(respond);
	})
	.delete(function(req, res) {
		var person = req.body;

		deletePersonFromList(person);

		var respond = {
			deleted: person,
			message: 'DELETE Request Received - Delete'
		};
		console.log(respond);

		updateDataTimestamp();
		respond.data = householdData;
		res.status(200).json(respond);
	});

module.exports = router;

function getUniqueId() {
	return uniqueId++;
}

function updateDataTimestamp() {
	householdData.updated = new Date();
}

function incrementDataCount(person) {
	householdData.count.total++;
	switch (person.relationship) {
		case 'child':
			householdData.count.children++;
			break;
		case 'parent':
			householdData.count.parents++;
			break;
		case 'spouse':
			householdData.count.spouses++;
			break;
		case 'grandparent':
			householdData.count.grandparents++;
			break;
		case 'self':
			householdData.count.self++;
			break;
		case 'other':
			householdData.count.other++;
			break;
	}
	householdData.list.push(person);
}

function deletePersonFromList(person) {
	householdData.count.total--;
	switch (person.relationship) {
		case 'child':
			householdData.count.children--;
			break;
		case 'parent':
			householdData.count.parents--;
			break;
		case 'spouse':
			householdData.count.spouses--;
			break;
		case 'grandparent':
			householdData.count.grandparents--;
			break;
		case 'self':
			householdData.count.self--;
			break;
		case 'other':
			householdData.count.other--;
			break;
	}

	for (var f = 0; f < householdData.list.length; f++) {
		var listedPerson = householdData.list[f];
		if (listedPerson.id !== parseInt(person.id))
			continue;
		householdData.list.splice(f, 1);
		break;
	}
}