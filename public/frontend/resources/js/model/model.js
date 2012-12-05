var currentBeer;var BeerModel = Backbone.Model.extend({	populate: function(beer, index){		this.set({name:beer.name, picture:beer.picture, abv:beer.abv, brewery:beer.brewery, beernr:beer.beernr, _id:beer._id, index:index } );	}});var BeerCollection = Backbone.Collection.extend({	populateCollection: function(beerList){		for(var i=0; i < beerList.length; i++)		{			var model = new BeerModel();			model.populate(beerList[i], i);			this.add(model);		}	},	setCurrentBeer:function(index){				if( index > ( this.length - 1 ) ){			index = 0;		}		else if( index < 0 ){			index = this.length - 1;		}				this.currentBeer = this.at(index);		this.trigger("updateBeer");	},	getCurrentBeer:function(){		return this.currentBeer;	}});