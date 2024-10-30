class Orbiting {
    constructor() {
        this.firstTimeModalFlag = "first-time-modal";
        this.orbit = document.getElementById("orbit");
        this.videoElement = document.getElementById("videoElement");
        this.messageHistory = document.getElementById("message-history");

        this.minFontSize = 2; // vh
        this.maxFontSize = 20; // vh
        this.currentFontSize = this.maxFontSize;

        this.toggleVideoBtn = document.getElementById("toggleVideoBtn");
        this.historyModal = document.getElementById("historyModal");
        this.helpBtn = document.getElementById("helpBtn");

        this.setupEventListeners();
        this.checkFirstView();
        this.resizeText();

        // Touch event variables
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;

        // Debounce setup
        this.debounceTimer = null;
        this.debounceDelay = 150; // ms

        this.setupKeyboardShortcuts();
        this.setupButtons();

        this.setupSwipeToDismiss();

        this.setupSwipeDown();

        this.clearHistoryBtn = document.getElementById("clearHistory");
        this.setupClearHistory();

        this.setupHistoryHandler();

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            this.fixMobileInput();
        }
        this.log("Orbiting initialized");
    }

    setupEventListeners() {
        this.orbit.addEventListener(
            "input",
            this.debouncedResizeText.bind(this),
        );
        this.orbit.addEventListener("input", this.handleManualClear.bind(this));

        // this.orbit.addEventListener("focus", this.clearInitialText.bind(this));
        // this.orbit.addEventListener("click", this.clearInitialText.bind(this));
        this.orbit.addEventListener(
            "touchstart",
            this.handleTouchStart.bind(this),
        );
        this.orbit.addEventListener("touchend", this.handleTouchEnd.bind(this));
        window.addEventListener("resize", this.debouncedResizeText.bind(this));

        document.querySelectorAll(".modal-trigger").forEach((trigger) => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                const modalId = e.target.getAttribute("data-modal");
                this.showModal(modalId);
            });
        });

        document.querySelectorAll(".modal .close").forEach((closeBtn) => {
            closeBtn.addEventListener("click", () => {
                this.hideModal(closeBtn.closest(".modal").id);
            });
        });

        document
            .getElementById("clearTextBtn")
            .addEventListener("click", () => this.clearText());

        this.toggleVideoBtn.addEventListener("click", () => this.toggleVideo());
        this.helpBtn.addEventListener("click", () => this.showHelp());
    }

    fixMobileInput() {
        const focusOrbit = () => {
            this.orbit.focus();
            window.scrollTo(0, 0);
        };

        window.addEventListener("load", focusOrbit);
        window.addEventListener("resize", focusOrbit);

        // Ensure contenteditable works on iOS
        this.orbit.setAttribute("contenteditable", "true");
        this.orbit.setAttribute("autocorrect", "off");
        this.orbit.setAttribute("autocapitalize", "off");
        this.orbit.setAttribute("spellcheck", "false");

        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener(
            "touchend",
            (e) => {
                const now = new Date().getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            },
            false,
        );
    }

    debouncedResizeText() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                this.resizeText();
            });
        }, this.debounceDelay);
    }

    setupClearHistory() {
        this.clearHistoryBtn.addEventListener("click", () => {
            localStorage.removeItem("messages");
            this.updateHistoryDisplay(); // Update the displayed history
            this.log("History cleared");
        });
    }

    updateHistoryDisplay() {
        const messages = this.getStoredText();
        const historyContent = document.getElementById("historyContent");
        if (messages.length === 0) {
            historyContent.innerHTML =
                '<div class="history-empty">No history available</div>';
        } else {
            const historyHTML = messages
                .map(
                    (message, index) =>
                        `<div class="history-item" data-id="${index}">${message}</div>`,
                )
                .join("");
            historyContent.innerHTML = historyHTML;
        }
        this.log("History display updated");
    }

    handleManualClear(event) {
        if (this.orbit.textContent.trim().length === 0) {
            const previousContent = event.target.previousContent;
            if (
                previousContent &&
                previousContent.trim() !== ""

            ) {
                this.storeText(previousContent);
                this.log("Message added to history after manual clear");
            }
        }
        event.target.previousContent = this.orbit.textContent;
    }

    resizeText() {
        try {
            let fontSize = this.maxFontSize;
            this.orbit.style.fontSize = `${fontSize}vh`;

            const resizeForKeyboard = () => {
                const viewportHeight = window.visualViewport
                    ? window.visualViewport.height
                    : window.innerHeight;
                this.orbit.style.height = `${viewportHeight}px`;

                while (
                    (this.orbit.scrollHeight > this.orbit.clientHeight ||
                        this.orbit.scrollWidth > this.orbit.clientWidth) &&
                    fontSize > this.minFontSize
                ) {
                    fontSize -= 0.5;
                    this.orbit.style.fontSize = `${fontSize}vh`;
                }
            };

            resizeForKeyboard();

            // Remove existing listeners to prevent duplicates
            if (this.resizeHandler) {
                window.visualViewport.removeEventListener(
                    "resize",
                    this.resizeHandler,
                );
                window.removeEventListener("resize", this.resizeHandler);
            }

            // Add event listeners for keyboard appearance
            this.resizeHandler = () => {
                resizeForKeyboard();
                this.currentFontSize = fontSize;
                this.log(`Text resized to ${fontSize}vh`);
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener(
                    "resize",
                    this.resizeHandler,
                );
            } else {
                window.addEventListener("resize", this.resizeHandler);
            }

            this.currentFontSize = fontSize;
            this.log(`Text resized to ${fontSize}vh`);
        } catch (error) {
            this.logError("Error in resizeText:", error);
        }
    }

    clearText() {
        try {
            this.storeText();
            this.orbit.textContent = "";
            this.orbit.focus();
            this.resizeText();
            this.log("Text cleared");
        } catch (error) {
            this.logError("Error in clearText:", error);
        }
    }



    getStoredText() {
        try {
            return JSON.parse(localStorage.getItem("messages")) || [];
        } catch (error) {
            this.logError("Error getting stored text:", error);
            return [];
        }
    }

    storeText(text = null) {
        try {
            const enteredText = text || this.orbit.textContent;
            if (enteredText && enteredText !== "") {
                const messages = this.getStoredText();
                messages.unshift(enteredText);
                localStorage.setItem("messages", JSON.stringify(messages));
                this.log("Text stored");
            }
        } catch (error) {
            this.logError("Error storing text:", error);
        }
    }

    showHistory() {
        this.updateHistoryDisplay(); // Update history display when showing history
        this.showModal("historyModal");
    }

    adjustModalForMobile(modalId) {
        const modal = document.getElementById(modalId);
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            modal.classList.add("mobile-view");
        } else {
            modal.classList.remove("mobile-view");
        }
    }

    setupHistoryHandler() {
        const historyContent = document.getElementById("historyContent");
        historyContent.addEventListener(
            "click",
            this.historyItemClickHandler.bind(this),
        );
    }

    historyItemClickHandler(e) {
        try {
            const messageId = e.target.dataset.id;
            const messages = this.getStoredText();
            const message = messages[messageId];
            this.orbit.textContent = message;
            this.hideModal("historyModal");
            this.resizeText();
            this.log("History item selected");
        } catch (error) {
            this.logError("Error in history item click handler:", error);
        }
    }

    checkFirstView() {
        const firstView = JSON.parse(localStorage.getItem("first-view"));
        if (firstView === null) {
            this.showModal("welcomeModal");
            localStorage.setItem("first-view-new", JSON.stringify(true));
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "block";
        modal.classList.add("show");
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "none";
        modal.classList.remove("show");
    }

    toggleVideo() {
        if (this.videoElement.style.display === "none") {
            this.orbit.classList.add("video-text");
            this.videoElement.style.display = "block";
            this.startVideo();
            this.toggleVideoBtn.classList.add("active");
            this.toggleVideoBtn.title = "Disable Video";
        } else {
            this.stopVideo();
            this.toggleVideoBtn.classList.remove("active");
            this.toggleVideoBtn.title = "Enable Video";
            this.orbit.classList.remove("video-text");
            this.videoElement.style.display = "none";
        }
    }

    startVideo() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    this.videoElement.srcObject = stream;
                })
                .catch((error) => {
                    console.error("Error accessing camera:", error);
                });
        }
    }

    stopVideo() {
        const stream = this.videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        this.videoElement.srcObject = null;
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        e.preventDefault(); // P700b
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        this.handleSwipe();
    }

    setupSwipeDown() {
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        document.addEventListener(
            "touchstart",
            (e) => {
                touchStartY = e.touches[0].clientY;
            },
            false,
        );

        document.addEventListener(
            "touchend",
            (e) => {
                e.preventDefault(); // P1161
                touchEndY = e.changedTouches[0].clientY;
                this.handleSwipeDown();
            },
            false,
        );

        // this.handleSwipeDown = () => {
        //     const swipeDistance = touchEndY - touchStartY;
        //     if (swipeDistance > minSwipeDistance) {
        //         this.showHelp();
        //     }
        // };
    }

    showHelp() {
        this.showModal("helpModal");
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const swipeThreshold = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    // Swipe right
                    this.showHelp();
                } else {
                    // Swipe left
                    this.clearText();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > swipeThreshold) {
                if (deltaY < 0) {
                    // Swipe up
                    this.showHistory();
                }
                // else {
                //     // Swipe down
                //     this.showHelp();
                // }
            }
        }
    }

    log(message) {
        console.log(`[Orbiting] ${message}`);
    }

    logError(message, error) {
        console.error(`[Orbiting] ${message}`, error);
    }

    setupKeyboardShortcuts() {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey) {
                // Ctrl key (or Cmd key on Mac)
                switch (e.key) {
                    case "h":
                    case "H":
                        e.preventDefault();
                        this.showHistory();
                        break;
                    case "x":
                    case "X":
                        e.preventDefault();
                        this.clearText();
                        break;
                }
            }
        });
    }

    setupButtons() {
        const showHistoryBtn = document.getElementById("showHistoryBtn");
        const clearTextBtn = document.getElementById("clearTextBtn");

        showHistoryBtn.addEventListener("click", () => this.showHistory());
        clearTextBtn.addEventListener("click", () => this.clearText());
    }

    setupSwipeToDismiss() {
        let startY;
        let startX;
        const threshold = 100; // minimum distance traveled to be considered swipe

        this.historyModal.addEventListener(
            "touchstart",
            (e) => {
                const touches = e.touches[0];
                startY = touches.clientY;
                startX = touches.clientX;
            },
            false,
        );

        this.historyModal.addEventListener(
            "touchmove",
            (e) => {
                if (!startY || !startX) {
                    return;
                }

                let moveY = e.touches[0].clientY;
                let moveX = e.touches[0].clientX;

                let diffY = startY - moveY;
                let diffX = startX - moveX;

                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe
                    if (Math.abs(diffX) > threshold) {
                        this.hideModal("historyModal");
                        startY = null;
                        startX = null;
                    }
                }
            },
            false,
        );
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Initializing Orbiting app...');
    new Orbiting();
    console.log('Orbiting app initialized successfully');
  } catch (error) {
    console.error('Error initializing Orbiting app:', error);
    // Display a user-friendly error message
    document.body.innerHTML = '<h1>Oops! Something went wrong.</h1><p>Please refresh the page or try again later.</p>';
  }
});
