var collection;var IndexView = Backbone.View.extend({	render: function(collection){		this.collection = collection;		for( var i = 0; i < collection.length; i++ )		{			var model = collection.at(i);			var template = _.template( $("#index_template").html(), model.attributes );						console.log(this.$el);						// Load the compiled HTML into the Backbone "el"			this.$el.append( template );		}	},	events:{		"click a": "goToBeer"	},		goToBeer:function(event){		var index = $(event.currentTarget).attr("beerIndex");		this.collection.setCurrentBeer(index);	}});