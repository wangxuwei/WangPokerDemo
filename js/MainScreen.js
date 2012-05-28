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
		var $result = $e.find(".winMessage .result");
		$winMessage.hide();
		$who.empty();
		$player1.empty();
		$player2.empty();
		//two plays
		var players = [$player1,$player2];
		var gCards = [];
		var cards = app.cards.retriveCards();
		for(var i = 0; i < players.length * 5; i++){
			gCards.push(app.cards.getCard(cards));
		}
		
		app.util.serialResolve(gCards,function(obj,i){
			var cardInfo = obj;
			var dfd = $.Deferred();
			var parent = ".player"+(i % 2 + 1);
			brite.display("Card",{card:cardInfo,transparent:true},{parent:parent}).done(function(card){
				rotate.call(c,card,players[i%2]).done(function(){
					dfd.resolve();
				});	
			});
			return dfd.promise();
		}).done(function(){
			var pCards1 = [];
			var pCards2 = [];
			$player1.find(".Card").each(function(){
				pCards1.push($(this).data("card"));
			});
			$player2.find(".Card").each(function(){
				pCards2.push($(this).data("card"));
			});
			if(app.cards.compare1(pCards1,pCards2) > 0){
				$who.html("Player1");
				$result.html("Win");
			}else if(app.cards.compare1(pCards1,pCards2) < 0){
				$who.html("Player2");
				$result.html("Win");
			}else{
				$who.html("");
				$result.html("Draw");
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
        domElement.x = $dealer.offset().left - $player.offset().left;
        domElement.y = $dealer.offset().top - $player.offset().top;
        stage.addChild(domElement);
        Ticker.setFPS(32);
        Ticker.addListener(stage);
        
        var size = $player.find(".Card").size();
        var y = size * 20;
         
        //Apply a tween to the form
        Tween.get(domElement).to({alpha:1, y:y,x:0, rotation:720},2000,Ease.cubicOut).call(function(){
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
