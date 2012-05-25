(function($){

	function Dealer(){};
  
	// --------- Component Interface Implementation ---------- //
	Dealer.prototype.create = function(data,config){
		var html = $("#tmpl-Dealer").html();
		return $(html);
	}
		
	Dealer.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		var cards = [0,1,2];
		app.util.serialResolve(cards,function(obj,i){
			var dfd = $.Deferred();
			brite.display("Card").done(function(card){
				card.$element.css("left",(i*10)+"px");
				dfd.resolve();
			});
			return dfd.promise();
		});
		
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	
	// --------- /Component Private API --------- //
	// --------- Component Private API --------- //	
	
	// --------- /Component Public API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Dealer",{
        parent: ".MainScreen",
        loadTmpl:true
    },function(){
        return new Dealer();
    });
	// --------- /Component Registration --------- //
})(jQuery);
