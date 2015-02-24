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
	var userDetails = {first:'Jane', surname:'Patel', age:23, gender:'Male'};
	localStorage.setItem("userDetails",JSON.stringify(userDetails));
}

function getData() {
	var userDetails = JSON.parse( localStorage.getItem('userDetails'));
	return userDetails;
}

function displayDetails(details) {
	var text = '';
	for(var i in details) {
		text += i + ': ' + details[i] + '<br>';
	}
	$("#result").html(text); 
}


