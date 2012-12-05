var self = this;

$(document).ready( function(){

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
	
	self.beerHolder = $("#beer");
	self.index = $("#index");
	
	window.beerView = new BeerView({
		el:"#beer"
	});
	window.beerView.on("nextBeer", nextBeer);
	window.beerView.on("prevBeer", nextBeer);
	window.beerView.on("back", back);
	
	self.beerHolder.hide();

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
		self.index.show();
		self.beerHolder.hide(300);
	}
	else{
		window.beerView.render(window.beerCollection.getCurrentBeer());
		self.beerHolder.show(300, function(){
			self.index.hide();
		});
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

function nextBeer(){
	
	var nextIndex = window.beerCollection.getCurrentBeer().get("index");
	window.beerCollection.setCurrentBeer(nextIndex + 1);
	window.beerView.render(window.beerCollection.getCurrentBeer());
}

function prevBeer(){
	var nextIndex = window.beerCollection.getCurrentBeer().get("index");
	window.beerCollection.setCurrentBeer(nextIndex - 1);
	window.beerView.render(window.beerCollection.getCurrentBeer());
}

function back(){
	window.beerCollection.setCurrentBeer(undefined);
	console.log(window.beerCollection.getCurrentBeer());
}