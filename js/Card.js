(function($){

	function Card(){};
  
	// --------- Component Interface Implementation ---------- //
	Card.prototype.create = function(data,config){
		var card = null;
		var transparent = false;
		if(data && data.card){
			card = data.card;
		}
		if(data && data.transparent){
			transparent = data.transparent;
		}
		var html = $("#tmpl-Card").render({card:card,transparent:transparent});
		return $(html);
	}
		
	Card.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	Card.prototype.show = function(){
		var c = this;
		var $e = this.$element;
		$e.addClass("show");
	}
	// --------- /Component Private API --------- //
	// --------- Component Private API --------- //	
	
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Card",{
        parent: ".Dealer",
        loadTmpl:true
    },function(){
        return new Card();
    });
	// --------- /Component Registration --------- //
})(jQuery);
