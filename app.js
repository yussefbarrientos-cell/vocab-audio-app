// app.js
let state = {
  currentIndex: 0,
  words: [...vocabData],
  timer: null,
  secondsLeft: 30
};

// Map Document References
const wordEl = document.getElementById('current-word');
const posEl = document.getElementById('part-of-speech');
const defEl = document.getElementById('word-definition');
const progressEl = document.getElementById('progress-bar');
const counterEl = document.getElementById('counter');
const cardTrigger = document.getElementById('card-trigger');
const nextBtn = document.getElementById('next-btn');
const pacerEl = document.getElementById('pacer');

function init() {
  renderWord();
  // Allow manual override replays when tapped directly by mobile thumbs
  cardTrigger.addEventListener('click', speakCurrentWord);
  nextBtn.addEventListener('click', advanceWord);
}

function renderWord() {
  const current = state.words[state.currentIndex];
  wordEl.innerText = current.word;
  posEl.innerText = current.partOfSpeech;
  defEl.innerText = current.definition;
  
  // Track system progression metrics
  const progressPercent = ((state.currentIndex + 1) / state.words.length) * 100;
  progressEl.style.width = `${progressPercent}%`;
  counterEl.innerText = `Word ${state.currentIndex + 1} of ${state.words.length}`;
  
  // Clean countdown pipeline and allocate fresh 30s chunk
  clearInterval(state.timer);
  state.secondsLeft = 30;
  updateTimerDisplay();
  
  state.timer = setInterval(() => {
    state.secondsLeft--;
    updateTimerDisplay();
    
    if (state.secondsLeft <= 0) {
      advanceWord();
    }
  }, 1000);

  speakCurrentWord();
}

function updateTimerDisplay() {
  pacerEl.innerText = `⏱️ Next word in ${state.secondsLeft}s`;
}

function advanceWord() {
  if (state.currentIndex < state.words.length - 1) {
    state.currentIndex++;
    renderWord();
  } else {
    clearInterval(state.timer);
    showEndScreen();
  }
}

function speakCurrentWord() {
  if ('speechSynthesis' in window) {
    // Flush current speech stack to prevent overlap delay loops
    window.speechSynthesis.cancel(); 
    
    const currentWordText = state.words[state.currentIndex].word;
    const utterance = new SpeechSynthesisUtterance(currentWordText);
    
    utterance.rate = 0.85; // Calibrated for clear phonetic articulation
    utterance.pitch = 1.0;
    utterance.lang = 'en-US'; 
    
    window.speechSynthesis.speak(utterance);
  }
}

function showEndScreen() {
  cardTrigger.innerHTML = `
    <div class="text-emerald-400 text-5xl mb-3 animate-bounce">🎉</div>
    <h2 class="text-2xl font-bold mb-1">Session Complete!</h2>
    <p class="text-slate-400 text-xs text-center px-4 max-w-xs">All 111 target terms processed inside the 56-minute window.</p>
  `;
  nextBtn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);
