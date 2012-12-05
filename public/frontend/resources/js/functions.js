var self = this,
storageKey = 'LUDDEDRGD';

$(document).ready( function(){

	window.beerCollection = new BeerCollection();
	window.beerCollection.on("update", onUpdate);
	var jqxhrGetBeers = $.get("http://192.168.1.2:3000/beers/", function(beerList) {
			beerCollection.populateCollection(beerList);
			self.applicationStartup();
		}).error(function() {
			console.log("error");
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

function adaptSize(){
	if( $(window).width() < 600 ){
		$("#beerIndex").children().css("width", "40%");
	}
	else{
		$("#beerIndex").children().css("width", "25%");
	}
}


function applicationStartup(){
	checkLogin();
	window.indexView = new IndexView({
		el:"#beerIndex"
	});
	window.indexView.render(window.beerCollection);
	
	$(window).resize(function(){
		self.adaptSize();
	});
	self.adaptSize();
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

function doLogin(msg) {
    var inputName;
    do {
        inputName=prompt(msg || 'Vad heter du?');
	} while(inputName.length < 2);
	console.log('do login');
	var newUser = {name: inputName},
	jqxhrPost = $.post("http://192.168.1.2:3000/users/", newUser, function(data) {
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
		var jqxhrGet = $.get("http://192.168.1.2:3000/users/" + user._id, function() {
			console.log("success in loading existing user");
		}).error(function() {
			console.log("error");
		});
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