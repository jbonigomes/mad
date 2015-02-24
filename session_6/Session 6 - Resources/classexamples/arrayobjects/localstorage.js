$(document).on("pagecontainerbeforeshow", function (e, ui) {
	var page = $.mobile.pageContainer.pagecontainer('getActivePage').attr( 'id' );
	if(page === "localstorage") {
		if (typeof(Storage) != "undefined") {
			storeData();
			displayDetails(getData());
		} else {
		$("#nostorage").text("The browser does not support storage");  
		}
	}
});

function storeData() {
	var userDetails = [
	{firstname:'James', surname:'Patel', age:23, gender:'Male'},
	{firstname:'Carol', surname:'Piters', age:29, gender:'Female'}, 
	{firstname:'Boris', surname:'Ivanovich', age:29, gender:'Female'}];
	localStorage.setItem("userDetails",JSON.stringify(userDetails));
}

function getData() {
	var userDetails = JSON.parse( localStorage.getItem('userDetails'));
	return userDetails;
}

function displayDetails(details) {
	var person = '';
	for(var i in details) {
	person += (parseInt(i)+1) + ': ' 
	+ details[i].firstname + " "
	+ details[i].surname + ", "
	+ details[i].age + ", "
	+ details[i].gender + '<br>';
	}
	$("#result").html(person); 
}


