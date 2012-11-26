$(document).ready(function(){
	
	for(var i=0; i < 10; i++)
	{
		var object = { beerLink:"test", image:"anchor.jpg", beerNumber:"1", beerName:"Anchor Christmas", abv:"5.5%" };
	
		$.tmpl('<li><a class="beer" href="${beerLink}"><img src="${image}" alt="" /><p>${beerNumber}.${beerName}(${abv})</p><p>${abv}</p></a></li>', object).appendTo("#beerIndex");
	
	}
	
	
	
	
});