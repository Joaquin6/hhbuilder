/**
 * Utility object with globally accessible methods.
 * In other terms, `helpers`.
 * @type  {Object}
 */
var Utility = {
	uniqueId: 1,
	/**
	 * Capitalize the first letter in the string
	 * @param   {String}  string  Original string to be modified
	 * @return  {String}          Modified string with leading capitalized character
	 */
	capitalizeFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	generateUniqueId: function() {
		this.uniqueId++;
		return this.uniqueId;
	},
	/**
	 * [formatJSON description]
	 * @param   {Object|Array}  json        The data object to be formatted
	 * @param   {Function}  	handler   	A replacer or filter that can be a function or an array.
	 *                                 		If it is an array, it specifies by name which entries to include in the stringify result.
	 *                                  	If it is a function, it can be used to eliminate entries or change their values.
	 *                                  	As with the stringify method itself, the results of the filter or replacer differ depending
	 *                                  	upon whether you are applying it to an object or an array.
	 *                                  	@link http://www.dyn-web.com/tutorials/php-js/json/filter.php
	 * @param   {Number}  		indentation Output of stringified JSON indentation amount. Default to 4
	 * @return  {String}               		Returns the stringified JSON string
	 */
	formatJSON: function(json, handler, indentation) {
		json = json || {};
		handler = handler || null;
		indentation = indentation || 4;
		return JSON.stringify(json, handler, indentation);
	}
};

/**
 * List object with methods to modify the list in the DOM
 * @type {Object}
 */
var list = {
	element: null,
	initialize: function() {
		this.element = document.getElementsByClassName('household')[0];
		this.element.setAttribute('style', 'float:right; margin:0; width:45%;');
	},
	add: function(data) {
		console.log('Adding Person to Household List');
		data.id = Utility.generateUniqueId();
		var listItem = this.createItem(data);
		this.element.appendChild(listItem);
	},
	/**
	 * Creates a <li> element with its containing inner text.
	 * The inner text is composed of the data passed in.
	 * @param   {Object}  data  The validated person to be added to the List
	 * @return  {Object}        Returns the created <li> element.
	 */
	createItem: function(data) {
		/** @type {Object} Create the <li> element */
		var listItem = document.createElement("LI");
		listItem.setAttribute('id', 'person' + data.id);
		listItem.setAttribute('data-uniqueId', data.id);
		listItem.setAttribute('data-age', data.age);
		listItem.setAttribute('data-relationship', data.relationship);

		/** @type {Object} Create the <button> element */
		var deleteBtn = this.__createLIDeleteBtn();

		/** @type {String} Build up the Inner Text for the <li> element */
		var liText = Utility.capitalizeFirstLetter(data.relationship);
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
	},
	get: function(id) {
		id = id || '*';
		var children = this.element.children, listObj = [], child, childInputs;
		for (var x = 0; x < children.length; x++) {
			child = children[x];
			childInputs = {
				id: child.getAttribute('data-uniqueId'),
				age: child.getAttribute('data-age'),
				relationship: child.getAttribute('data-relationship')
			};
			if (id !== '*' && id === childInputs.id) {
				return childInputs;
			}
			listObj.push(childInputs);
		}
		return listObj;
	},
	remove: function(data) {
		console.log('Deleting ' + data.id + ' from Household List');
		var item = document.getElementById('person' + data.id);
		item.parentNode.removeChild(item);
	},
	__createLIDeleteBtn: function() {
		var self = this;
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
			self.remove(validInputs);
		});
		return deleteBtn;
	}
};

/**
 * Form object with methods to validate form inputs and behavior
 * @type {Object}
 */
var form = {
	element: null,
	initialize: function() {
		this.element = document.getElementsByTagName('form')[0];
		this.element.setAttribute('id', 'houseform');
		this.element.setAttribute('style', 'float:left; margin:0; width:45%;');
		/** Setup the initial event handlers */
		this.setupHandlers();
	},
	setupHandlers: function() {
		var self = this;
		/** Handler for `Add` Button Click */
		this.getButton('add').addEventListener('click', function(e) {
			e.preventDefault();
			var validInputs = self.validateInputs();
			if (!validInputs) {
				console.log('Form Inputs are Invalid');
				console.log(validInputs);
			} else {
				console.log('Form Inputs are Valid!');
				console.log(validInputs);
				list.add(validInputs);
			}
		});

		/** Handler for `Submit` Button Click */
		this.getButton('submit').addEventListener('click', function(e) {
			e.preventDefault();
			hhDebug.show({
				list: list.get('*')
			});
		});
	},
	highlightInput: function(element, type) {
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
	},
	validateInputs: function() {
		var elements =  this.element.elements;
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
						this.highlightInput(element, 'error');
						return false;
					}
					inputs.age = val;
					key = 'age';
					title = 'Age Value: ';
					break;
				case 'rel':
					val = element.value;
					if (!val) {
						this.highlightInput(element, 'error');
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

			this.highlightInput(element, 'success');

			if (inputs.query)
				inputs.query += '&';
			inputs.query += key + '=' + val;
		}

		return inputs;
	},
	getButton: function(type) {
		type = type || 'submit';

		var buttons = this.element.getElementsByTagName('button'), x;

		for (x = 0; x < buttons.length; x++) {
			var button = buttons[x];
			if (button.textContent === type)
				return button;
		}
		return null;
	}
};

var hhDebug = {
	element: null,
	initialize: function() {
		this.element = document.getElementsByClassName('debug')[0];
		this.element.setAttribute('style', 'float:left; width:100%; overflow-x:auto;');
	},
	hide: function() {
		this.element.innerText = '';
		this.element.style.display = 'none';
	},
	show: function(data) {
		this.element.innerText = Utility.formatJSON(data, null, 4);
		this.element.style.display = 'inline-block';
	}
};

/** @type {Function} Initial Trigger - Starting Point */
window.onload = function() {
	list.initialize();
	form.initialize();
	hhDebug.initialize();
};
