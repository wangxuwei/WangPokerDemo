(function($){

	function MainScreen(){};
  
	// --------- Component Interface Implementation ---------- //
	MainScreen.prototype.create = function(data,config){
		var html = $("#tmpl-MainScreen").html();
		return $(html);
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $canvas = $e.find(".baseCanvas");
		$canvas[0].width = $e.width();
		$canvas[0].height = $e.height();
		
		brite.display("Table");
		brite.display("Dealer");
		
		$e.on("click",".btnGo:not(.disable)",function(){
			$(this).addClass("disable");
			deal.call(c);
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	
	// --------- /Component Public API --------- //
	
	// --------- /Component Private API --------- //
	deal = function(){
		var c = this;
		var $e = c.$element;
		
		var $player1 = $e.find(".player.player1");
		var $player2 = $e.find(".player.player2");
		var $winMessage = $e.find(".winMessage");
		var $who = $e.find(".winMessage .who");
		$winMessage.hide();
		$who.empty();
		$e.find(".poker").empty();
		var players = [$player1,$player2];
		var cards = app.cards.getCards();
		var first = parseInt(Math.random() * 50);
		var card1 = cards[first];
		cards.splice(first,1);
		var second = parseInt(Math.random() * 49);
		var card2 = cards[second];
		cards.splice(second,1);
		var gCards = [card1,card2];
		var t = false;
		app.util.serialResolve(gCards,function(obj,i){
			var cardInfo = obj;
			var dfd = $.Deferred();
			var parent = ".poker";
			brite.display("Card",{card:cardInfo,transparent:true},{parent:parent}).done(function(card){
				rotate.call(c,card,players[i]).done(function(){
					dfd.resolve();
				});	
			});
			return dfd.promise();
		}).done(function(){
			if(app.cards.compare(card1,card2)){
				$who.html("Player1");
			}else{
				$who.html("Player2");
			}
			$winMessage.show();
			$e.find(".btnGo").removeClass("disable");
		});
	}
	
	rotate = function(card,$player){
		var c = this;
		var $e = c.$element;
		var dfd = $.Deferred();
		
		var $card = card.$element;
		var stage = new Stage();
		var $canvas = $e.find(".baseCanvas");
		var $dealer = $e.find(".Dealer");
		 
        var stage = new Stage($canvas[0]);
        //DOMElement creation
        var domElement = new DOMElement($card[0]);
        domElement.regX = $card.width()/2;
        domElement.regY = $card.height()/2;
        //move the form above the screen
        domElement.x = $dealer.position().left;
        domElement.y = $dealer.position().top;
        stage.addChild(domElement);
        Ticker.setFPS(32);
        Ticker.addListener(stage);
         
        //Apply a tween to the form
        Tween.get(domElement).to({alpha:1, y:$player.offset().top,x:$player.offset().left, rotation:720},2000,Ease.cubicOut).call(function(){
        	stage.removeChild(domElement);
        	card.show();
        	dfd.resolve();
        });
        
        return dfd.promise();
	}
	// --------- Component Private API --------- //	
	
	
	// --------- Component Registration --------- //
	brite.registerComponent("MainScreen",{
        parent: "#page",
        emptyParent: true,
        loadTmpl:true
    },function(){
        return new MainScreen();
    });
	// --------- /Component Registration --------- //
})(jQuery);
