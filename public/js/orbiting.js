
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
}

function clearStoredText(){
    localStorage.setItem("messages", JSON.stringify([]));
}



/* Handle the interface */


$(function(){
    $("#orbit").focus();
});

/* Motion and swipes */
$("#orbit").on("swipeleft", function(e) { 
    resetScroll();
    clearText();
});

$("#orbit").on("swiperight", function(e) { 
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
