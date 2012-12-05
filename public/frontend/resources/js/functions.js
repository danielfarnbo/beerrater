var self = this,
storageKey = 'LUDDEDRGD';

$(document).bind('pageinit', function(){

	if( !window.beerCollection )
	{
		window.beerCollection = new BeerCollection();
		window.beerCollection.on("update", onUpdate);
		
		$.ajax({
		  url: "resources/json/ales.json",
		  context: document.body,
		  contentType:JSON,
		}).done(function(beerList) { 
			beerCollection.populateCollection(beerList);
			self.applicationStartup();
		});
	}
});

function applicationStartup(){
	checkLogin();
	window.indexView = new IndexView({
		el:"#beerIndex"
	});
	window.indexView.render(window.beerCollection);
	
}

function onUpdate(){
	checkLogin();
	if( window.beerCollection.getCurrentBeer() === undefined ){
		$.mobile.changePage("index.html");
		console.log("UNDEFINED");
	}
	else{
		$.mobile.changePage("beer.html");
	}
}

function doLogin(msg) {
    var inputName;
    do {
        inputName=prompt(msg || 'Vad heter du?');
	} while(inputName.length < 2);
	console.log('do login');
	var newUser = {name: inputName},
	jqxhrPost = $.post("http://localhost:3000/users/", newUser, function(data) {
		if (data.error) {
			doLogin('Namnet upptaget, välj ett annat. ');
		} else if (data.name && data._id) {
			$.jStorage.set(storageKey, data);
		} else {
			alert('Något gick fel. Laddar om sidan.');
			location.reload();
		}
		console.log(data);
	})
	.error(function() { doLogin('Namnet upptaget, välj ett annat. '); });
}


function checkLogin() {
	var user = $.jStorage.get(storageKey);
	console.log(user);

	if (user) {
		var jqxhrGet = $.get("http://localhost:3000/users/" + user._id, function() {
			console.log("success in loading existing user");
		}).error(function() {
			console.log("error");
		});
	} else {
		doLogin();
	}
}