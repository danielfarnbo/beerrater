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
	window.indexView = new IndexView({
		el:"#beerIndex"
	});
	window.indexView.render(window.beerCollection);
	
}

function onUpdate(){
	if( window.beerCollection.getCurrentBeer() == undefined ){
		$.mobile.changePage("index.html");
		console.log("UNDEFINED");
	}
	else{
		$.mobile.changePage("beer.html");
	}
}