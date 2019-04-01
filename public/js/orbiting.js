
/* Functionality */
 
function clearText(){
    storeText();
    var container = $("#orbit")
    container.css('font-size', 20+"vh");
    container.html("");
    container.focus("");
}

function clearInitialText(){
    var container = $("#orbit")
    if (container.html()=="type here"){
        container.html("");
        container.focus("");
}


function resetScroll(){
    window.setTimeout(function() {window.scrollTo(0,0);}, 0);
}

function dynamicResize() {
    var container = $("#orbit")
    console.log("resize")
    /*
    var container = $("#orbit")
    var compressor = 1
    var minFontSize = 10;
    var maxFontSize = 500;
    console.log("container width: " + container.width())
    var value = Math.max(Math.min(container.width() / (compressor * 10), parseFloat(maxFontSize)), parseFloat(minFontSize))
    console.log(value)
    setFontSize(value)
    */
    var font = $(container).scaleFontSize({ minFontsize: 12 });
    console.log(font)
    
}

$.fn.scaleFontSize = function (options) {
    var defaults = {
        minFontsize: 16 //px
    },
        calcDiff = 2; // weird IE offset/scroll difference

    return $(this).each(function () {
        options = $.extend(defaults, options);
        console.log("test")
        var scrollWidth = this.scrollWidth - calcDiff,
            offsetWidth = this.offsetWidth,
            scrollHeight = this.scrollHeight - calcDiff,
            offsetHeight = this.offsetHeight,
            fontsize = parseFloat($(this).css('font-size')),
            minFontsize = parseFloat(options.minFontsize);

        console.log("scrollWidth: " + scrollWidth)
        console.log("offsetWidth: " + offsetWidth)
        console.log("scrollHeight: " + scrollHeight)
        console.log("offsetHeight: " + offsetHeight)
        console.log("fontsize: " + fontsize)
        console.log("minFontsize: " + minFontsize)


        while (fontsize > minFontsize && (scrollHeight > offsetHeight || scrollWidth > offsetWidth)) {
            console.log(fontsize);
            $(this).css('font-size', --fontsize);
            scrollWidth = this.scrollWidth;
            scrollHeight = this.scrollHeight;
        }

    });
};


var resizer = function () {
    $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
};

function increaseFontSize(increment) {
    var container = $("#orbit")
    var fontSize = parseInt(container.css("font-size"));
    console.log("Old Font size: " + fontSize)
    fontSize = (fontSize + increment) + "px";
    console.log("New Font size: " + fontSize)
    container.css({ 'font-size': fontSize });
}

function decreaseFontSize(increment) {
    var container = $("#orbit")
    var fontSize = parseInt(container.css("font-size"));
    console.log("Old Font size: " + fontSize)
    fontSize = (fontSize - increment) + "px";
    console.log("New Font size: " + fontSize)
    container.css({ 'font-size': fontSize });
}

function setFontSize(size) {
    var container = $("#orbit")
    var fontSize = parseInt(container.css("font-size"));
    console.log("Old Font size: " + fontSize)
    fontSize = (size) + "px";
    console.log("New Font size: " + fontSize)
    container.css({ 'font-size': fontSize });
}

function getStoredText(){
    var messages = JSON.parse(localStorage.getItem("messages"));
    if (messages == null){
        messages = [];
    }
    return messages;
}

function storeText(){
    var enteredText = $("#orbit").text();
    if (enteredText != "type here"){
        if (enteredText != "") {
            var messages = getStoredText();
            messages.unshift(enteredText);
            localStorage.setItem("messages", JSON.stringify(messages));
            displayStoredMessages();
            
        }

    }
    
    
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
        $("#welcomeModal").modal("show");
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
        $("#orbit").addClass("video-text")
        $("#videoElement").toggle();
        if (navigator.mediaDevices.getUserMedia) {       
            navigator.mediaDevices.getUserMedia({video: true})
                .then(function(stream) {
                    video.srcObject = stream;
                })
                .catch(function() {

                });
        }
        $("#toggle-video-button").text("Disable Video");
    }else{
        video.pause();
        video.srcObject = null;
        if (navigator.mediaDevices.getUserMedia) {       
            navigator.getUserMedia({audio: false, video: true},
                function(stream) {
                    var track = stream.getTracks()[0];  // if only one media track
                    track.stop();
                },
                function(){

                });
        }
        $("#toggle-video-button").text("Enable Video");
        $("#orbit").removeClass("video-text")
        $("#videoElement").toggle();
        
    }

}

function mobileAndTabletcheck() {
    var check = false;
    // eslint-disable-next-line no-useless-escape
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function flashScreenNormal() {
    console.log("Normal")
    $("body").removeClass("inverted");
    return true
}


function flashScreenInvert(){
    console.log("Invert")
    $("body").addClass("inverted");

    

    return true
}

function flashToggle(){
    flashScreenInvert();
    setTimeout(flashScreenNormal, 250);
    //flashScreenNormal();
    return true;
}

function flashStop(){

}

function flashScreen() {
    var flasher = setInterval(flashToggle, 500);
    setTimeout(clearTimeout, 3000, flasher);
}


//var clr = setInterval(flash, 1000);

/* Handle the interface */


/* links */


/* modals */
$('#aboutModal').modal({ show: false })
$("#show-about-link").click(function () {
    $(".drawer").drawer("close");
    $('#aboutModal').modal('show');
    return false;
});

$('#aboutModal').on('hidden.bs.modal', function () {
    $("#orbit").focus();
})

$('#helpModal').modal({ show: false })
$("#show-help-link").click(function () {
    $(".drawer").drawer("close");
    $('#helpModal').modal('show');
    return false;
});

$('#helpModal').on('hidden.bs.modal', function () {
    $("#orbit").focus();
})

$('#welcomeModal').modal({ show: false })
$("#show-welcome-link").click(function () {
    $('#welcomeModal').modal('show');
    return false;
});

$('#welcomeModal').on('hidden.bs.modal', function () {
    $("#orbit").focus();
})

$('#settingsModal').modal({ show: false })
$("#show-settings-link").click(function () {
    $(".drawer").drawer("close");
    $('#settingsModal').modal('show');
    return false;
});

$('#settingsModal').on('hidden.bs.modal', function () {
    $("#orbit").focus();
})


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
    var showVideo = false;
    if (!mobileAndTabletcheck()){
        showVideo = true;
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
        showVideo = false;
    }

    if (showVideo){
        $("#toggle-video-button").show();
    }else{
        $("#toggle-video-button").hide();
    }



    firstView();
});

$(".drawer").on("drawer.opened", function(){

});

window.addEventListener('deviceshake', function () {
    flashScreen()
}, false);


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

$('.drawer').on('drawer.closed', function () { 
    $("#orbit").focus();
    $("#orbit").focus();
});

/* Dynamic resizing */

window.addEventListener("resize", dynamicResize);
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
