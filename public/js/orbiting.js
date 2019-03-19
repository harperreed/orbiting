$(function(){
    $('#orbit').focus()

  });



$('#orbit').on('swipeleft', function(e) { 
    $('#orbit').html('')
    window.setTimeout(function() {window.scrollTo(0,0);}, 0);
});

$('#orbit').on('tap', function(e) { 
    window.setTimeout(function() {window.scrollTo(0,0);}, 0);
   if ($('#orbit').html()=="type here"){
    $('#orbit').html('')   
  }
});

$('#orbit').on('click', function(e) { 
    window.setTimeout(function() {window.scrollTo(0,0);}, 0);
   if ($('#orbit').html()=="type here"){
    $('#orbit').html('')   
  }
});

var textarea = $('#orbit');
textarea.bind('change input', function() {
  //textarea.css({'font-size':(textarea.css('font-size').replace('px','')-3)});
  dynamicResize()
  
}); 

function dynamicResize() {
    //console.log("this should resize the font when it gets too big")
    
    /*
  $("#orbit").fitText();
      http://jsfiddle.net/aj9tarnu/

    */
}

 



/* we need this only on touch devices */
    /* cache dom references */ 
    var $body = jQuery('body'); 

    /* bind events */
    $(document)
    .on('focus', 'input', function() {
        $body.addClass('no-scroll');
    })
    .on('blur', 'input', function() {
        $body.removeClass('no-scroll');
    });
