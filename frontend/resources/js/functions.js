var startup=false;

$(document).bind('pageinit', function(){
	
	window.beerCollection = new BeerCollection();
	
	$.ajax({
	  url: "resources/json/ales.json",
	  context: document.body,
	  contentType:JSON,
	}).done(function(beerList) { 
		console.log(beerList);
		beerCollection.populateCollection(beerList);
	});
	
	
});

$(document).bind('pagechange',function(event, data){
	console.log(data.toPage[0].outerHTML);
});

function setupIndex(){
	for(var i=0; i < beerList.length; i++)
	{
		var object=beerList[i];
		$.tmpl('<li><a class="beer" href="${beerLink}" data-beerIndex=' + i + '	data-transition="fade"><img src="${image}" alt="" /><p>${beerNumber}.${beerName}(${abv})</p><p>${brewery}</p></a></li>', object).appendTo("#beerIndex");
	}
	startup = true;
}
	
function setupSubPage(pageIndex){
	var beer=beerList[pageIndex]
	//$.tmpl('<img src="${image}" alt="" /><section><p>${beerNumber}.${beerName} (${abv})</p><p>${brewery}</p></section><label for="score">Score </label><input id="score" type="number" value="0" min="0" max="100"/><div id="drinking"><i class="icon-beer"></i> I'm drinking this beer</div>', object).appendTo("#templateContent");
}