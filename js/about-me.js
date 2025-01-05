/*========== scroll reveal ==========*/
ScrollReveal({
  reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".heading", { origin: "top" });
ScrollReveal().reveal(".contact form , .about-text", { origin: "bottom" });
ScrollReveal().reveal(".contact p, .skills", { origin: "left" });
ScrollReveal().reveal(".liste, .home-content p, .about-content", {
  origin: "right",
});

// ----------------------------
// Animation des barres de compétences
// Animation qui démarre lorsque les barres de compétences deviennent visibles à l'écran
// ----------------------------
(function() {
	
	var SkillsBar = function( bars ) {
		this.bars = document.querySelectorAll( bars );
		if( this.bars.length > 0 ) {
			this.init();
		}	
	};
	
	SkillsBar.prototype = {
		init: function() {
			var self = this;
			self.index = -1;
			self.timer = setTimeout(function() {
				self.action();
			}, 500);
			
			
		},
		select: function( n ) {
			var self = this,
				bar = self.bars[n];
				
				if( bar ) {
					var width = bar.parentNode.dataset.percent;
				
					bar.style.width = width;
					bar.parentNode.classList.add( "complete" );	
				
                    if (width !== "100%") {
                        bar.parentNode.classList.add("not-full");
                    }
                }
		},
		action: function() {
			var self = this;
			self.index++;
			if( self.index == self.bars.length ) {
				clearTimeout( self.timer );
			} else {
				self.select( self.index );	
			}
			
			setTimeout(function() {
				self.action();
			},500);
		}
	};
	
	window.SkillsBar = SkillsBar;
	
})();

(function() {
	document.addEventListener( "DOMContentLoaded", function() {
		var skills = new SkillsBar( ".skillbar-bar" );
	});
})();
  

