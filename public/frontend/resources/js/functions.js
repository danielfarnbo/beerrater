var self = this;

$(document).bind('pageinit', function(){

	window.beerCollection = new BeerCollection();
	
	$.ajax({
	  url: "resources/json/ales.json",
	  context: document.body,
	  contentType:JSON,
	}).done(function(beerList) { 
		beerCollection.populateCollection(beerList);
		self.applicationStartup();
	});
});

function applicationStartup(){
	window.indexView = new IndexView({
		el:"#beerIndex"
	});
	window.indexView.render(window.beerCollection);
}