var app = app || {};
(function($){
	app.cards = {};
	var numbers = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
	var colors = [
	              {value:"&spades;",color:"black"},
	              {value:"&hearts;",color:"red"},
	              {value:"&clubs;",color:"black"},
	              {value:"&diams;",color:"red"}
	];
	
	app.cards.getCards = function(){
		var cards = [];
		for(var i = 0; i < numbers.length; i++){
			for(var j = 0; j < colors.length; j++){
				cards.push({number:numbers[i],colorObj:colors[j]});
			}
		}
		return cards;
	}
	
	app.cards.compare = function(card1,card2){
		if(getValueByNumber(card1.number) > getValueByNumber(card2.number)){
			return true;
		}else if(getValueByNumber(card1.number) == getValueByNumber(card2.number)){
			if(getValueByColor(card1.colorObj) > getValueByColor(card2.colorObj)){
				return true;
			}
		}
		return false;
	}
	
	function getValueByNumber(number){
		for(var i = 0; i < numbers.length; i++){
			if(number == numbers[i]){
				return i;
			}
		}
	}
	
	function getValueByColor(colorObj){
		for(var i = 0; i < colors.length; i++){
			if(colorObj.value == colors[i].value){
				return i;
			}
		}
	}
	
})(jQuery);

