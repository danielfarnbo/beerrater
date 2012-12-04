var self = this;

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

function doLogin() {
	cosole.log('do login');
}

function checkLogin() {
	var user = {name: 'Daniel6', _id: '50be8435f6a92b5e34000002'};//localStorage.getItem('BONANZAUSER');

	if (user) {
		var jqxhr = $.get("http://localhost:3000/users/" + user._id, function() {
			console.log("success");
		}).error(function() { console.log("error"); });
	} else {
		doLogin();
	}
}