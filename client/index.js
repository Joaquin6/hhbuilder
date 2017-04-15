var builder, debugCont, houseHoldList, houseForm, addBtn, submitBtn;

window.onload = initialize;

function initialize() {
	setupMainElements();
	handleFormSubmission();
	checkExistingData();
}

function setupMainElements() {
	builder = document.getElementsByClassName('builder')[0];
	builder.setAttribute('style', 'margin:0px auto; width:100%;');

	houseHoldList = document.getElementsByClassName('household')[0];
	houseHoldList.setAttribute('style', 'float:right; margin:0; width:45%;');

	houseForm = document.getElementsByTagName('form')[0];
	houseForm.setAttribute('id', 'houseform');
	houseForm.setAttribute('style', 'float:left; margin:0; width:45%;');

	debugCont = builder.nextElementSibling;
	debugCont.setAttribute('style', 'float:left; width:100%; overflow-x:auto; text-align: center;');
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
			}, function(res) {
				addToList(res.added);
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
			}, function(res) {
				debugVisibility(true, res.data);
			});
		}
	});
}

function checkExistingData() {
	request('GET', null, {
		path: '/houseform'
	}, function(res) {
		if (res.data.count.total > 0) {
			var existingListItems = res.data.list;
			for (var d = 0; d < existingListItems.length; d++) {
				addToList(existingListItems[d]);
			}
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
	var title = 'Element Value: ', name = '', key = '';
	var inputs = {
		query: ''
	}, val, x, element;

	for (x = 0; x < elements.length; x++) {
		element = elements[x];
		name = element.name || '';

		if (!name) continue;

		switch (name) {
			case 'age':
				val = parseInt(element.value);
				if (isNaN(val) || val < 1) {
					highlightFormInput(element, 'error');
					return false;
				}
				inputs.age = val;
				key = 'age';
				title = 'Age Value: ';
				break;
			case 'rel':
				val = element.value;
				if (!val) {
					highlightFormInput(element, 'error');
					return false;
				}
				inputs.relationship = val;
				key = 'relationship';
				title = 'Relationship Value: ';
				break;
			case 'smoker':
				val = element.value = 'off';
				if (element.checked)
					val = element.value = 'on';
				inputs.smoker = val;
				key = 'smoker';
				title = 'Smoker Value: ';
				break;
		}

		highlightFormInput(element, 'success');

		if (inputs.query)
			inputs.query += '&';
		inputs.query += key + '=' + val;
	}

	return inputs;
}

function highlightFormInput(element, type) {
	if (type === 'error') {
		element.style.border = '2px solid red';
		element.style.boxShadow = '0 0 3px red';
		element.setAttribute('isvalid', 'false');
	} else {
		if (element.hasAttribute('style'))
			element.removeAttribute('style');
		if (element.hasAttribute('isvalid'))
			element.removeAttribute('isvalid');
	}
}

function request(method, params, options, callback) {
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
			if (callback)
				callback(json);
		}
	}
	if (params)
		params = JSON.stringify(params);
	http.send(params);
}

function debugVisibility(show, context) {
	show = (show !== undefined) ? show : true;
	if (show) {
		debugCont.innerText = JSON.stringify(context);
		debugCont.style.display = 'inline-block';
	} else {
		debugCont.innerText = '';
		debugCont.style.display = 'none';
	}
}

function addToList(data) {
	console.log('Adding Person to Household List');
	var listItem = createListItem(data);
	/** Append <li> to <ol> */
	houseHoldList.appendChild(listItem);
}

function removeFromList(data) {
	console.log('Deleting ' + data.id + ' from Household List');
	var item = document.getElementById('person' + data.id);
	item.parentNode.removeChild(item);
}

/**
 * Creates a <li> element with its containing inner text.
 * The inner text is composed of the data passed in.
 * @param   {Object}  data  The validated person to be added to the List
 * @return  {Object}        Returns the created <li> element.
 */
function createListItem(data) {
	/** @type {Object} Create the <li> element */
	var listItem = document.createElement("LI");
	listItem.setAttribute('id', 'person' + data.id);
	listItem.setAttribute('data-uniqueId', data.id);
	listItem.setAttribute('data-age', data.age);
	listItem.setAttribute('data-relationship', data.relationship);

	/** @type {Object} Create the <button> element */
	var deleteBtn = createLIDeleteBtn();

	/** @type {String} Build up the Inner Text for the <li> element */
	var liText = capitalizeFirstLetter(data.relationship);
	liText += ' - ' + 'Age: ' + data.age;
	if (data.smoker === 'off')
		liText += ' - ' + 'Non-Smoker';
	else
		liText += ' - ' + 'Smoker';

	/** @type {Object} Create a text node w/ the built <li> text */
	var textNode = document.createTextNode(liText);

	/** Append the text node to <li> */
	listItem.appendChild(textNode);

	/** Append the delete <button> node */
	listItem.appendChild(deleteBtn);

	return listItem;
}

function createLIDeleteBtn() {
	/** @type {Object} Create the <button> element */
	var deleteBtn = document.createElement("BUTTON");
	deleteBtn.setAttribute('id', 'DeletePerson');
	deleteBtn.setAttribute('style', 'margin-left: 10px;');
	/** @type {Object} Create a text node for the `x` character */
	var xcode = document.createTextNode('X');
	/** Append the text node to <button> */
	deleteBtn.appendChild(xcode);
	/** Add Event Listener */
	deleteBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var parent = this.parentElement;
		var validInputs = {
			id: parent.getAttribute('data-uniqueId'),
			age: parent.getAttribute('data-age'),
			relationship: parent.getAttribute('data-relationship')
		};
		console.log(validInputs);

		request('DELETE', validInputs, {
			path: '/houseform'
		}, function(res) {
			removeFromList(res.deleted);
		});
	});
	return deleteBtn;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}