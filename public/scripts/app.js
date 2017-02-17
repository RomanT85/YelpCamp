$(".brand").mouseenter(function() {
	$( this ).fadeTo( "fast", Math.random() );

	$(".brand").mouseleave(function(){
	$( this ).css("color", "#ffffff")
	});
	});