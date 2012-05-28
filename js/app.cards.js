var app = app || {};
(function($){
	app.cards = {};
	var numbers = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
	var colors = ["&spades;","&hearts;","&clubs;","&diams;"];
	
	var types = {
			0:"hight card",
			1:"one pair",
			2:"two pairs",
			3:"three of a kind",
			4:"straight",
			5:"flush",
			6:"full house",
			7:"four of a kind",
			8:"straight flush",
			9:"royal flush"
	};
	
	/*
	 * get the color value , which is red or black
	 */
	app.cards.getColorValue = function(color){
		if(color == "&spades;"){
			return "black";
		}else if(color == "&hearts;"){
			return "red";
		}else if(color == "&clubs;"){
			return "black";
		}else if(color == "&diams;"){
			return "red";
		}
	}
	
	/*
	 * retrive a deck of cards
	 * card type: {
	 * 				number:'J',
	 * 				color:'&spades;'
	 * 			  }
	 */
	app.cards.retriveCards = function(){
		var cards = [];
		for(var i = 0; i < numbers.length; i++){
			for(var j = 0; j < colors.length; j++){
				cards.push({number:numbers[i],color:colors[j]});
			}
		}
		return cards;
	}
	
	/*
	 * get a card in cards by random
	 */
	app.cards.getCard = function(cards){
		var n = cards.length;
		var index = parseInt(Math.random() * n);
		var card = cards[index];
		cards.splice(index,1);
		return card;
	}
	
	app.cards.compare = function(card1,card2){
		if(getValueByNumber(card1.number) > getValueByNumber(card2.number)){
			return true;
		}else if(getValueByNumber(card1.number) == getValueByNumber(card2.number)){
			if(getValueByColor(card1.color) > getValueByColor(card2.color)){
				return true;
			}
		}
		return false;
	}
	
	/*
	 * compare cards
	 * 
	 * if cards1 > cards2, return 1
	 * if cards1 == cards2, return 0
	 * if cards1 < cards2, return -1
	 *
	 */
	app.cards.compare1 = function(cards1,cards2){
		var group1 = combineToGroup(cards1);
		var group2 = combineToGroup(cards2);
		var type1 = getType(group1);
		var type2 = getType(group2);
		if(type1 > type2){
			return 1;
		}else if(type1 == type2){
			for(var i = 0; i < group1.length; i++){
				var obj1 = group1[i];
				var obj2 = group2[i];
				var value1,value2;
				if(typeof obj1.length != 'undefined'){
					value1 = getValueByNumber(obj1[0].number);
					value2 = getValueByNumber(obj2[0].number);
				}else{
					value1 = getValueByNumber(obj1.number);
					value2 = getValueByNumber(obj2.number);
				}
				if(value1 != value2){
					return value1 > value2 ? 1 : -1;
				}
			}
			return 0;
		}
		return -1;
	}
	
	/*
	 * get value for card number
	 */
	function getValueByNumber(number){
		for(var i = 0; i < numbers.length; i++){
			if(number == numbers[i]){
				return i;
			}
		}
	}
	
	/*
	 * get value for card color
	 */
	function getValueByColor(color){
		for(var i = 0; i < colors.length; i++){
			if(color == colors[i]){
				return i;
			}
		}
	}
	
	
	/*
	 * combine new cards to group, and analyze group
	 */
	function combineToGroup(cards){
		var cardsCache = [].concat(cards);
		var group = [];
		
		//to get pairs , three of a kind of four of a kind  if there exist
		for(var i = 0; i < cardsCache.length;i++){
			var gs = [];
			var pairs = false;
			for(var j = i + 1; j < cardsCache.length;j++){
				if(cardsCache[i].number == cardsCache[j].number){ 
					if(!pairs){
						pairs = true;
					}
					gs.push(cardsCache[j]);
					cardsCache.splice(j,1);
					j--;
				}
			}
			if(pairs){
				gs.push(cardsCache[i]);
				cardsCache.splice(i,1);
				i--;
			}
			
			if(gs.length > 0){
				group.push(gs);
			}
		}
		group = group.concat(cardsCache);
		
		// to get not pair types
		if(group.length == 5){
			cardsCache = group;
			// sort
			for(var i = 0; i < cardsCache.length; i++){
				for(var j = i + 1; j < cardsCache.length; j++){
					var value1 = getValueByNumber(cardsCache[i].number);
					var value2 = getValueByNumber(cardsCache[j].number);
					if(value1 < value2){
						var card = cardsCache[i];
						cardsCache[i] = cardsCache[j];
						cardsCache[j] = card;
					}
				}
			}
			
			var staight = true;
			var flush = false;
			for(var i = 0; i < cardsCache.length; i++){
				var value1 = getValueByNumber(cardsCache[i].number);
				var color1 = cardsCache[i].color;
				var value2;
				var color2;
				if(i + 1 < cards.length){
					value2 = getValueByNumber(cardsCache[i + 1].number);
					color2 = cardsCache[i + 1].color;
				}
				if(value2 && value2 != value1 - 1){
					if(staight){
						staight = false;
					}
				}
				if(color2 && color2 != color1){
					if(flush){
						flush = false;
					}
				}
			}
			if(staight || flush){
				group = [].push(group);
			}
			
		}else{
			// sort cards
			for(var i = 0; i < group.length; i++){
				for(var j = i + 1; j < group.length; j++){
					if(typeof group[i].length != "undefined"){
						if(typeof group[j].length != "undefined"){
							if(group[i].length < group[j].length){
								var card = group[i];
								group[i] = group[j];
								group[j] = card;
							}else if(group[i].length == group[j].length){
								var value1 = getValueByNumber(group[i][0].number);
								var value2 = getValueByNumber(group[j][0].number);
								if(value1 < value2){
									var card = group[i];
									group[i] = group[j];
									group[j] = card;
								}
							}
						}
					}else{
						if(typeof group[j].length != "undefined"){
							var card = group[i];
							group[i] = group[j];
							group[j] = card;
						}else{
							var value1 = getValueByNumber(group[i].number);
							var value2 = getValueByNumber(group[j].number);
							if(value1 < value2){
								var card = group[i];
								group[i] = group[j];
								group[j] = card;
							}
						}
					}
				}
			}
		}
		return group;
	}
	
	
	/*
	 * get type value of group, so we can group is like which type. such as: one pair,two pairs
	 */
	function getType(group){
		var value;
		if(group.length == 1){
			if(group[0][0].color == group[0][1].color && getValueByNumber(group[0][0].number) == getValueByNumber(group[0][1].number) + 1){
				value = 8;
				// 12 means A
				if(getValueByNumber(group[0][0].number) == 12){
					value = 9;
				}
			}else if(getValueByNumber(group[0][0].number) != getValueByNumber(group[0][1].number) + 1){
				value = 5;
			}else if(group[0][0].color != group[0][1].color){
				value = 4;
			}
		}else if(group.length == 2){
			if(group[0].length == 4){
				value = 7;
			}else if(group[0].length == 3){
				value = 6;
			}
		}else if(group.length == 3){
			if(group[0].length == 3){
				value = 3;
			}else if(group[0].length == 2){
				value = 2;
			}
		}else if(group.length == 4){
			value = 1;
		}else{
			value = 0;
		}
		console.log(types[value]);
		return value;
	}
	
//	var group = combineToGroup([		{
//		  				number:'3',
//		  					color:"&spades;",
//		  			},
//		  			{
//		  				number:'3',
//		  				color:"&hearts;",
//		  			},
//		  			{
//		  				number:'4',
//		  				color:"&clubs;",
//		  			},
//		  			{
//		  				number:'4',
//		  				color:"&diams;",
//		  			},
//		  			{
//		  				number:'6',
//		  				color:"&clubs;",
//		  			}]);
//	console.log(getType(group));
	
})(jQuery);

