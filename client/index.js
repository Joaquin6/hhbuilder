var builder, houseForm, addBtn, submitBtn;

function Person(params) {
	this.age = params.age;
	this.relationship = params.relationship;
	this.smoker = params.smoker;
}

window.onload = initialize;

function initialize() {
	setupMainElements();
	handleFormSubmission();
}

function setupMainElements() {
	builder = document.getElementsByClassName("builder")[0];
	houseForm = document.getElementsByTagName("form")[0];
	houseForm.setAttribute('id', 'houseform');
}

function handleFormSubmission() {
	addBtn = getFormBtn('add');
	addBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var validInputs = validateFormInputs(houseForm.elements);
		if (!validInputs) {
			console.log('Form Inputs are Invalid');
			console.log(validInputs);
		} else {
			console.log('Form Inputs are Valid!');
			console.log(validInputs);
			request('PUT', validInputs, {
				path: '/houseform'
			});
		}
	});

	submitBtn = getFormBtn('submit');
	submitBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var validInputs = validateFormInputs(houseForm.elements);
		if (!validInputs) {
			console.log('Form Inputs are Invalid');
			console.log(validInputs);
		} else {
			console.log('Form Inputs are Valid!');
			console.log(validInputs);
			request('POST', validInputs, {
				path: '/houseform'
			});
		}
	});
}

function getFormBtn(type) {
	type = type || 'submit';

	var buttons = houseForm.getElementsByTagName('button'), x;

	for (x = 0; x < buttons.length; x++) {
		var button = buttons[x];
		if (button.textContent === type)
			return button;
	}
	return null;
}

function validateFormInputs(elements) {
	var title = 'Element Value: ', name = '';
	var inputs = {
		query: ''
	}, val, x, element;
	for (x = 0; x < elements.length; x++) {
		element = elements[x];
		name = element.name || '';
		if (name) {
			switch(name) {
				case 'age':
					val = parseInt(element.value);
					if (val < 1)
						return false;
					inputs.age = val;

					if (inputs.query)
						inputs.query += '&age=' + val;
					else
						inputs.query += 'age=' + val;

					title = 'Age Value: ';
					break;
				case 'rel':
					val = element.value;
					if (!val)
						return false;
					inputs.relationship = val;

					if (inputs.query)
						inputs.query += '&relationship=' + val;
					else
						inputs.query += 'relationship=' + val;

					title = 'Relationship Value: ';
					break;
				case 'smoker':
					val = element.value = 'off';
					if (element.checked)
						val = element.value = 'on';
					inputs.smoker = val;

					if (inputs.query)
						inputs.query += '&smoker=' + val;
					else
						inputs.query += 'smoker=' + val;

					title = 'Smoker Value: ';
					break;
			}
		}
	}

	if (console.table) {
		var person = new Person(inputs);
		console.table(person);
	}

	return inputs;
}

function request(method, params, options) {
	/** @type {String} Set method to post by default if not specified. */
	method = method || 'POST';

	var http = new XMLHttpRequest();
	var url = window.location.origin + options.path;

	console.log('XMLHttpRequest Endpoint: ', url);
	http.open(method, url, true);
	/** Send the proper header information along with the request */
	http.setRequestHeader('Content-type', 'application/json');
	/** Act on State Change */
	http.onreadystatechange = function() {
		if (http.readyState === 4 && http.status === 200) {
			var json = JSON.parse(http.responseText);
			console.log(json);
		}
	}
	/** Send the Stringified JSON Object */
	http.send(JSON.stringify(params));
}