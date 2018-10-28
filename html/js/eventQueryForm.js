/**
 * This file acts like a module. This has a predefined html and css file packaged with it for the form. 
 * @file is where the form html file is 
 * @ID is the div element where the form will be embedded.
 * @callback - function that accepts json data. 
 */
function embedQueryForm(ID, file, callback) {
	var container = document.getElementById(ID);
	var form = document.createElement("object");
	
	form.id="query_form";
	form.type="text/html";
	form.data=file;

	container.appendChild(form);

	/*

	form.getElementById("submit_button").addEventListener("click", function(e) {
		var jsonData = null; // Do XMLHttpRequest stuff with the file location of the form
		callback(jsonData); 
	});

	*/
}