var houseForm;

window.onload = initialize;

function initialize() {
	houseForm = setupForm();
	houseForm.addEventListener("click", function() {
		houseForm.submit();
	});
}

function setupForm() {
	houseForm = document.getElementsByTagName("form")[0];
	houseForm.setAttribute('id', 'houseform');
	return houseForm;
}