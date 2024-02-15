/* globals */

const container_id = "orbit";

/* Functionality */

/**
 * Clears the text content from the element with ID 'orbit' and sets focus to it.
 * Also stores the current text before clearing.
 */
function clearText() {
    storeText();
    var container = document.getElementById(container_id);
    if (container) {
        console.debug("Clearing text from #orbit element.");
        container.style.fontSize = "10vh";
        container.innerHTML = "";
        container.focus();
    } else {
        console.error("Element with ID 'orbit' not found.");
    }
}

/**
 * Clears the initial text 'type here' from the element with ID 'orbit' if present and sets focus to it.
 */
function clearInitialText() {
    var container = document.getElementById(container_id);
    if (container.textContent.trim() === "type here") {
        console.debug(
            "Initial text 'type here' found, clearing #orbit element.",
        );
        container.textContent = "";
        container.focus();
    } else {
        console.debug("Initial text 'type here' not found, no action taken.");
    }
}

/**
 * Resets the scroll position to the top of the page after a brief delay.
 */
function resetScroll() {
    window.setTimeout(() => {
        console.debug("Resetting scroll position to top.");
        window.scrollTo(0, 0);
    }, 0);
}

/**
 * Dynamically resizes the font size of the '#orbit' element based on its container width and height.
 */
function dynamicResize() {
    const container = document.getElementById(container_id);
    console.debug("Dynamic resize triggered.");

    if (container) {
        const font = scaleFontSize(container, { minFontsize: 12 });
        console.debug("New font size after dynamic resize: ", font);
    } else {
        console.error(
            "Element with ID 'orbit' not found for dynamic resizing.",
        );
    }
}

/**
 * Scales the font size of the given element based on its scrollWidth and scrollHeight.
 * @param {HTMLElement} element - The DOM element to resize.
 * @param {Object} options - Configuration options for resizing.
 * @returns {number} The new font size applied to the element.
 */
function scaleFontSize(element, options) {
    const defaults = {
        minFontsize: 16, //px
    };
    const settings = Object.assign({}, defaults, options);
    const calcDiff = 2; // Adjusting for potential scroll offset

    let scrollWidth = element.scrollWidth - calcDiff;
    let offsetWidth = element.offsetWidth;
    let scrollHeight = element.scrollHeight - calcDiff;
    let offsetHeight = element.offsetHeight;
    let fontsize = parseFloat(window.getComputedStyle(element).fontSize);
    const minFontsize = parseFloat(settings.minFontsize);

    console.debug("Starting dynamic font scaling with settings: ", settings);

    while (
        fontsize > minFontsize &&
        (scrollHeight > offsetHeight || scrollWidth > offsetWidth)
    ) {
        fontsize--;
        element.style.fontSize = `${fontsize}px`;
        scrollWidth = element.scrollWidth - calcDiff;
        scrollHeight = element.scrollHeight - calcDiff;
    }

    console.debug("Completed dynamic font scaling. New font size: ", fontsize);
    return fontsize;
}

/**
 * Resizes the font size of the 'orbit' element dynamically based on its container width.
 */
function resizer() {
    var element = document.getElementById(container_id);
    if (!element) {
        console.error("Element with ID 'orbit' not found for resizing.");
        return;
    }

    var style = window.getComputedStyle(element);
    var fontSize = parseFloat(style.getPropertyValue("font-size"));
    var containerWidth = element.offsetWidth;
    var compressor = 1;
    var settings = {
        maxFontSize: 100, // Example max font size, this should be defined according to requirements
        minFontSize: 10, // Example min font size, this should be defined according to requirements
    };

    var newFontSize = Math.max(
        Math.min(containerWidth / (compressor * 10), settings.maxFontSize),
        settings.minFontSize,
    );

    element.style.fontSize = newFontSize + "px";
    console.debug("Resized font to: " + newFontSize + "px");
}

/**
 * Increases the font size of the element with ID 'orbit' by a given increment.
 * @param {number} increment - The amount by which to increase the font size.
 */
function increaseFontSize(increment) {
    const container = document.getElementById(container_id);
    if (!container) {
        console.error("Element with ID 'orbit' not found.");
        return;
    }
    const style = window.getComputedStyle(container);
    let fontSize = parseInt(style.getPropertyValue("font-size"), 10);
    console.debug(`Old Font size: ${fontSize}px`);
    fontSize += increment;
    console.debug(`New Font size: ${fontSize}px`);
    container.style.fontSize = `${fontSize}px`;
}

/**
 * Decreases the font size of the element with ID 'orbit' by a given decrement.
 * @param {number} decrement - The amount by which to decrease the font size.
 */
function decreaseFontSize(decrement) {
    const container = document.getElementById(container_id);
    if (!container) {
        console.error(
            "Element with ID 'orbit' not found for decreasing font size.",
        );
        return;
    }
    const style = window.getComputedStyle(container);
    let fontSize = parseInt(style.getPropertyValue("font-size"), 10);
    console.debug(`Old Font size: ${fontSize}px`);
    fontSize = Math.max(0, fontSize - decrement); // Ensure font size doesn't go negative
    console.debug(`New Font size: ${fontSize}px`);
    container.style.fontSize = `${fontSize}px`;
}

/**
 * Sets the font size of the element with ID 'orbit'.
 * @param {number} size - The new font size to apply to the element.
 */
function setFontSize(size) {
    const container = document.getElementById(container_id);
    if (!container) {
        console.error("Element with ID 'orbit' not found.");
        return;
    }
    const currentFontSize = parseFloat(
        window.getComputedStyle(container).getPropertyValue("font-size"),
    );
    console.debug(`Old Font size: ${currentFontSize}px`);
    container.style.fontSize = `${size}px`;
    console.debug(`New Font size: ${size}px`);
}

/**
 * Retrieves the stored text messages from local storage.
 * @returns {string[]} An array of stored messages.
 */
function getStoredText() {
    let messages = localStorage.getItem("messages");
    if (messages) {
        try {
            messages = JSON.parse(messages);
        } catch (e) {
            console.error(
                "Error parsing stored messages from localStorage: ",
                e,
            );
            messages = [];
        }
    } else {
        messages = [];
    }
    console.debug("Retrieved stored messages: ", messages);
    return messages;
}

/**
 * Stores the text from the element with ID 'orbit' into local storage, unless it is the placeholder text.
 * Updates the displayed message history accordingly.
 */
function storeText() {
    const container = document.getElementById(container_id);
    const enteredText = container.textContent;

    if (enteredText !== "type here" && enteredText !== "") {
        const messages = getStoredText();
        messages.unshift(enteredText);
        localStorage.setItem("messages", JSON.stringify(messages));
        displayStoredMessages();
        console.debug("Stored text: ", enteredText);
    } else {
        console.debug("No new text to store.");
    }
}

/**
 * Clears all stored text messages from local storage.
 * Updates the displayed message history to reflect the changes.
 */
function clearStoredText() {
    try {
        localStorage.setItem("messages", JSON.stringify([]));
        console.debug("Cleared stored text messages.");
    } catch (e) {
        console.error("Error clearing stored text messages: ", e);
    }
}

/**
 * Displays the stored messages in the message history list.
 */
function displayStoredMessages() {
    const messages = getStoredText();
    const history = document.getElementById("message-history");
    if (history) {
        history.innerHTML = ""; // Clear existing items

        messages.forEach((message, index) => {
            const itemLi = document.createElement("li");
            itemLi.className = "list-group-item";
            const itemA = document.createElement("a");
            itemA.textContent = message;
            itemA.dataset.id = index;
            itemA.href = "#";
            itemA.addEventListener("click", historyClickHandler);
            itemLi.appendChild(itemA);
            history.appendChild(itemLi);
        });
        console.debug("Displayed stored messages in history.");
    } else {
        console.error("Message history element not found.");
    }
}

/**
 * Handles click event on history items, setting the message text into the 'orbit' element.
 * @param {Event} e - The event object.
 */
function historyClickHandler(e) {
    e.preventDefault();
    const messageId = e.currentTarget.dataset.id;
    const messages = getStoredText();
    const message = messages[messageId];
    document.getElementById(container_id).textContent = message;
    // Assuming there is a method to close the drawer, but since it's not in the selected code, a placeholder comment is added.
    // closeDrawer(); // Placeholder for actual drawer close method
    console.debug(`Message with id ${messageId} from history clicked.`);
}

/**
 * Shows the welcome modal on the first visit by checking local storage.
 * Sets a flag in local storage to avoid showing it on subsequent visits.
 */
function firstView() {
    console.log("yeah! first view!");
    const firstViewKey = "first-view";
    let firstView = localStorage.getItem(firstViewKey);
    console.log(firstView);
    if (firstView === null) {
        const welcomeModal = document.getElementById("welcomeModal");
        if (welcomeModal) {
            const modal = new bootstrap.Modal(welcomeModal);
            modal.show();
            console.debug("Showing welcome modal for the first time.");
            localStorage.setItem(firstViewKey, JSON.stringify(true));
        } else {
            console.error("Welcome modal element not found.");
        }
    } else {
        console.debug(
            "Welcome modal has been shown before; not showing again.",
        );
    }
}
/**
 * Handles click event on history items, setting the message text into the 'orbit' element.
 * @param {Event} e - The event object.
 */
function historyClickHandler(e) {
    e.preventDefault();
    const messageId = e.currentTarget.getAttribute("data-id");
    const messages = getStoredText();
    const message = messages[messageId];
    const orbitElement = document.getElementById(container_id);
    orbitElement.textContent = message;
    const drawerElement = document.querySelector(".drawer");
    if (drawerElement && typeof drawerElement.drawer === "function") {
        drawerElement.drawer("close");
    }
    console.debug(
        `Message with id ${messageId} from history set into #orbit element.`,
    );
}

/**
 * Toggles the video stream from the user's camera on or off.
 */
function toggleVideo() {
    const videoElement = document.getElementById("videoElement");
    const toggleButton = document.getElementById("toggle-video-button");
    const orbitElement = document.getElementById("orbit");

    if (!videoElement.style.display || videoElement.style.display === "none") {
        orbitElement.classList.add("video-text");
        videoElement.style.display = "block";
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    videoElement.srcObject = stream;
                    console.debug("Video stream enabled.");
                })
                .catch(function (error) {
                    console.error("Error accessing media devices.", error);
                });
        }
        toggleButton.textContent = "Disable Video";
    } else {
        if (videoElement.srcObject) {
            const tracks = videoElement.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            console.debug("Video stream disabled.");
        }
        videoElement.pause();
        videoElement.srcObject = null;
        toggleButton.textContent = "Enable Video";
        orbitElement.classList.remove("video-text");
        videoElement.style.display = "none";
    }
}

function mobileAndTabletcheck() {
    var check = false;
    // eslint-disable-next-line no-useless-escape
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

/**
 * Flashes the screen to normal color.
 * Removes the 'inverted' class from the body element.
 * @returns {boolean} Always returns true.
 */
function flashScreenNormal() {
    console.log("Normal");
    document.body.classList.remove("inverted");
    return true;
}

/**
 * Flashes the screen to inverted color.
 * Adds the 'inverted' class to the body element.
 * @returns {boolean} Always returns true.
 */
function flashScreenInvert() {
    console.log("Invert");
    document.body.classList.add("inverted");
    return true;
}

/**
 * Toggles the flash screen effect by inverting the colors and then reverting to normal after a delay.
 * @returns {boolean} Always returns true.
 */
function flashToggle() {
    flashScreenInvert();
    setTimeout(flashScreenNormal, 250);
    console.debug("Flash toggle activated.");
    return true;
}

/**
 * Stops the flash screen effect by clearing the interval.
 * @param {number} flasher - The interval ID returned by setInterval for the flash effect.
 */
function flashStop(flasher) {
    clearInterval(flasher);
    console.debug("Flash screen effect stopped.");
}

/**
 * Initiates a flashing screen effect by toggling the screen colors at an interval,
 * then stopping the effect after a specified duration.
 */
function flashScreen() {
    console.debug("Flash screen effect initiated.");
    let flasher = setInterval(flashToggle, 500);
    setTimeout(() => {
        flashStop(flasher);
        console.debug("Flash screen effect ended after timeout.");
    }, 3000);
}

//var clr = setInterval(flash, 1000);

/* Handle the interface */

/* links */

/* modals */

$("#aboutModal").modal({ show: false });
$("#show-about-link").click(function () {
    $(".drawer").drawer("close");
    $("#aboutModal").modal("show");
    return false;
});

$("#aboutModal").on("hidden.bs.modal", function () {
    $("#orbit").focus();
});

$("#helpModal").modal({ show: false });
$("#show-help-link").click(function () {
    $(".drawer").drawer("close");
    $("#helpModal").modal("show");
    return false;
});

$("#helpModal").on("hidden.bs.modal", function () {
    $("#orbit").focus();
});

$("#welcomeModal").modal({ show: false });
$("#show-welcome-link").click(function () {
    $("#welcomeModal").modal("show");
    return false;
});

$("#welcomeModal").on("hidden.bs.modal", function () {
    $("#orbit").focus();
});

$("#settingsModal").modal({ show: false });
$("#show-settings-link").click(function () {
    $(".drawer").drawer("close");
    $("#settingsModal").modal("show");
    return false;
});

$("#settingsModal").on("hidden.bs.modal", function () {
    $("#orbit").focus();
});

$("#clear-history-link").click(function () {
    clearStoredText();
    displayStoredMessages();
    return false;
});

$("#toggle-video-button").click(function () {
    toggleVideo();

    return false;
});

/* Drawer */
$(document).ready(function () {
    $(".drawer").drawer();
    var showVideo = false;
    if (!mobileAndTabletcheck()) {
        showVideo = true;
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
        showVideo = false;
    }

    if (showVideo) {
        $("#toggle-video-button").show();
    } else {
        $("#toggle-video-button").hide();
    }

    firstView();
});

$(".drawer").on("drawer.opened", function () {});

window.addEventListener(
    "deviceshake",
    function (e) {
        flashScreen();
        e.preventDefault();
    },
    false,
);

$(function () {
    displayStoredMessages();
    $("#orbit").focus();
});

/* Motion and swipes */

$("#orbit").on("taphold", function (e) {
    $(".drawer").drawer("open");
});

$("#orbit").on("swiperight", function (e) {
    $(".drawer").drawer("open");
});

$("#orbit").on("swipeleft", function (e) {
    resetScroll();
    clearText();
});

$("#orbit").on("doubletap", function (e) {
    resetScroll();
    clearText();
});

$("#orbit").on("tap", function (e) {
    resetScroll();
    clearInitialText();
});

$("#orbit").on("click", function (e) {
    resetScroll();
    clearInitialText();
});

$(".drawer").on("drawer.closed", function () {
    $("#orbit").focus();
    $("#orbit").focus();
});

/* Dynamic resizing */

window.addEventListener("resize", dynamicResize);

var textarea = document.getElementById(container_id);

textarea.addEventListener("input", function () {
    dynamicResize();
    console.debug("Textarea content changed, triggering dynamic resize.");
});

/* we need this only on touch devices */
/* cache dom references */
var $body = jQuery("body");

/* bind events */
document.addEventListener(
    "focus",
    function (e) {
        if (e.target && e.target.tagName === "INPUT") {
            document.body.classList.add("no-scroll");
            console.debug("Input focused, no-scroll class added to body.");
        }
    },
    true,
);

document.addEventListener(
    "blur",
    function (e) {
        if (e.target && e.target.tagName === "INPUT") {
            document.body.classList.remove("no-scroll");
            console.debug("Input blurred, no-scroll class removed from body.");
        }
    },
    true,
);
