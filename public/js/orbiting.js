
/* Functionality */
 
function clearText(){
    storeText();
    $("#orbit").html("");

}

function clearInitialText(){
    if ($("#orbit").html()=="type here"){
        $("#orbit").html(""); 
    }
}

function resetScroll(){
    window.setTimeout(function() {window.scrollTo(0,0);}, 0);
}

function dynamicResize() {

}

function getStoredText(){
    var messages = JSON.parse(localStorage.getItem("messages"));
    if (messages == null){
        messages = [];
    }
    return messages;
}

function storeText(){
    var messages = getStoredText();
    var enteredText = $("#orbit").text();
    messages.unshift(enteredText);
    localStorage.setItem("messages", JSON.stringify(messages));
    displayStoredMessages();
}

function clearStoredText(){
    localStorage.setItem("messages", JSON.stringify([]));
}

function displayStoredMessages(){
    var messages = getStoredText();
    console.log(messages);
    //<li><a class="drawer-menu-item" href="#">history item</a></li>
    var history = $("#message-history");
    for (var i = 0; i < messages.length; i++ ) {
        var item = $("<li/>");
        item.addClass("drawer-menu-item");
        item.html(messages[i])
        history.append(item);
    }
}


/* Handle the interface */


/* Drawer */
$(document).ready(function() {
    $('.drawer').drawer();
  });

$('.drawer').on('drawer.opened', function(){

});


$(function(){
    displayStoredMessages()
    $("#orbit").focus();
});

/* Motion and swipes */
$("#orbit").on("swipeleft", function(e) { 
    resetScroll();
    clearText();
});

$("#orbit").on("swiperight", function(e) {
    $('.drawer').drawer("open");
});

$("#orbit").on("tap", function(e) { 
    resetScroll();
    clearInitialText();
});

$("#orbit").on("click", function(e) { 
    resetScroll();
    clearInitialText();
});

/* Dynamic resizing */

var textarea = $("#orbit");
textarea.bind("change input", function() {
    //textarea.css({"font-size":(textarea.css("font-size").replace("px","")-3)});
    dynamicResize();
  
}); 






/* we need this only on touch devices */
/* cache dom references */ 
var $body = jQuery("body"); 

/* bind events */
$(document)
    .on("focus", "input", function() {
        $body.addClass("no-scroll");
    })
    .on("blur", "input", function() {
        $body.removeClass("no-scroll");
    });
