class Orbiting {
  constructor() {
    this.orbit = document.getElementById('orbit');
    this.drawer = document.querySelector('.drawer');
    this.videoElement = document.getElementById('videoElement');
    this.toggleVideoButton = document.getElementById('toggle-video-button');
    this.clearHistoryLink = document.getElementById('clear-history-link');
    this.messageHistory = document.getElementById('message-history');

    this.minFontSize = 2; // vh
    this.maxFontSize = 20; // vh
    this.currentFontSize = this.maxFontSize;

    this.setupEventListeners();
    this.displayStoredMessages();
    this.checkFirstView();
    this.resizeText();
  }

  setupEventListeners() {
    this.orbit.addEventListener('input', this.resizeText.bind(this));
    this.orbit.addEventListener('click', this.clearInitialText.bind(this));
    this.orbit.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.orbit.addEventListener('touchend', this.handleTouchEnd.bind(this));
    window.addEventListener('resize', this.resizeText.bind(this));
    window.addEventListener('shake', this.flashScreen.bind(this));

    this.clearHistoryLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.clearStoredText();
    });

    this.toggleVideoButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleVideo();
    });

    document.querySelectorAll('.modal-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = e.target.getAttribute('data-modal');
        this.showModal(modalId);
      });
    });

    document.querySelectorAll('.modal .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        this.hideModal(closeBtn.closest('.modal').id);
      });
    });
  }

  resizeText() {
    let fontSize = this.maxFontSize;
    this.orbit.style.fontSize = `${fontSize}vh`;

    while (
      (this.orbit.scrollHeight > this.orbit.clientHeight ||
       this.orbit.scrollWidth > this.orbit.clientWidth) &&
      fontSize > this.minFontSize
    ) {
      fontSize -= 0.5;
      this.orbit.style.fontSize = `${fontSize}vh`;
    }

    this.currentFontSize = fontSize;
  }

  clearText() {
    this.storeText();
    this.orbit.textContent = '';
    this.orbit.focus();
    this.resizeText();
  }

  clearInitialText() {
    if (this.orbit.textContent === 'type here') {
      this.orbit.textContent = '';
      this.orbit.focus();
    }
  }

  getStoredText() {
    return JSON.parse(localStorage.getItem('messages')) || [];
  }

  storeText() {
    const enteredText = this.orbit.textContent;
    if (enteredText && enteredText !== 'type here') {
      const messages = this.getStoredText();
      messages.unshift(enteredText);
      localStorage.setItem('messages', JSON.stringify(messages));
      this.displayStoredMessages();
    }
  }

  clearStoredText() {
    localStorage.setItem('messages', JSON.stringify([]));
    this.displayStoredMessages();
  }

  displayStoredMessages() {
    const messages = this.getStoredText();
    this.messageHistory.innerHTML = '';

    messages.forEach((message, index) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const a = document.createElement('a');
      a.textContent = message;
      a.href = '#';
      a.dataset.id = index;
      a.addEventListener('click', this.historyClickHandler.bind(this));
      li.appendChild(a);
      this.messageHistory.appendChild(li);
    });
  }

  historyClickHandler(e) {
    e.preventDefault();
    const messageId = e.target.dataset.id;
    const messages = this.getStoredText();
    const message = messages[messageId];
    this.orbit.textContent = message;
    this.drawer.classList.remove('open');
    this.resizeText();
  }

  checkFirstView() {
    const firstView = JSON.parse(localStorage.getItem('first-view'));
    if (firstView === null) {
      this.showModal('welcomeModal');
      localStorage.setItem('first-view', JSON.stringify(true));
    }
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.classList.add('show');
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('show');
  }

  toggleVideo() {
    if (this.videoElement.style.display === 'none') {
      this.orbit.classList.add('video-text');
      this.videoElement.style.display = 'block';
      this.startVideo();
      this.toggleVideoButton.textContent = 'Disable Video';
    } else {
      this.stopVideo();
      this.toggleVideoButton.textContent = 'Enable Video';
      this.orbit.classList.remove('video-text');
      this.videoElement.style.display = 'none';
    }
  }

  startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }

  stopVideo() {
    const stream = this.videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    this.videoElement.srcObject = null;
  }

  flashScreen() {
    document.body.classList.add('inverted');
    setTimeout(() => {
      document.body.classList.remove('inverted');
    }, 250);
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;
    const deltaTime = touchEndTime - this.touchStartTime;

    if (deltaTime < 300) {
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
        if (deltaX > 0) {
          this.drawer.classList.add('open');
        } else {
          this.clearText();
        }
      } else if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
        this.clearInitialText();
      }
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new Orbiting();
});
