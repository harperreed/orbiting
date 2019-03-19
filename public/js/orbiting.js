
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


    var history = $("#message-history");
    history.html("");
    for (var i = 0; i < messages.length; i++ ) {
        var item_li = $("<li/>");
        item_li.addClass("list-group-item");
        var item = $("<a/>");
        item.html(messages[i]);
        item.attr("data-id", i);
        item.attr("href", "#");
        item.click(historyClickHandler);
        item_li.append(item);
        history.append(item_li);
    }
}

function firstView(){

    var firstView = JSON.parse(localStorage.getItem("first-view"));
    if (firstView==null){
        $("#helpModal").modal("show");
        localStorage.setItem("first-view", JSON.stringify(true));
    }
    
}

function historyClickHandler(e)
{
    var messageId =$(e.currentTarget).data("id");
    var messages = getStoredText();
    var message = messages[messageId];
    $("#orbit").html(message);
    $(".drawer").drawer("close");

    return false;
}


function toggleVideo(){
    var video = document.querySelector("#videoElement");
    
    if ($("#videoElement").is(":hidden")){
        console.log("hidden");
        $("#videoElement").toggle();
        if (navigator.mediaDevices.getUserMedia) {       
            navigator.mediaDevices.getUserMedia({video: true})
                .then(function(stream) {
                    video.srcObject = stream;
                })
                .catch(function(err0r) {
                    console.log("Something went wrong!");
                });
        }
        $("#toggle-video-button").text("Disable Video")
    }else{
        video.pause();
        video.srcObject = null;
        if (navigator.mediaDevices.getUserMedia) {       
            navigator.getUserMedia({audio: false, video: true},
                function(stream) {
                    var track = stream.getTracks()[0];  // if only one media track
                    track.stop();
                },
                function(error){
                    console.log('getUserMedia() error', error);
                });
        }
        $("#toggle-video-button").text("Enable Video")
        $("#videoElement").toggle();
        
    }

   
    
}

/* Handle the interface */


/* links */

$("#clear-history-link").click(function(){
    clearStoredText();
    displayStoredMessages();
    return false;
});

$("#toggle-video-button").click(function(){
    toggleVideo();
    
    return false;
});


/* Drawer */
$(document).ready(function() {
    $(".drawer").drawer();
    firstView();
});

$(".drawer").on("drawer.opened", function(){

});


$(function(){
    displayStoredMessages();
    $("#orbit").focus();
});

/* Motion and swipes */

$("#orbit").on("taphold", function(e) {
    $(".drawer").drawer("open");
});

$("#orbit").on("swiperight", function(e) {
    $(".drawer").drawer("open");
});

$("#orbit").on("swipeleft", function(e) { 
    resetScroll();
    clearText();
});

$("#orbit").on("doubletap", function(e) { 
    resetScroll();
    clearText();
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
