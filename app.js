const QUIZ_TIME = 20;

const questionSets = {
  science: {
    name: "Science",
    topic: "The living world",
    icon: "✦",
    description: "Nature, space & the things that make us wonder.",
    questions: [
      { text: "What is the only planet in our solar system known to support life?", options: ["Mars", "Earth", "Venus", "Jupiter"], answer: 1 },
      { text: "Which force keeps our feet on the ground?", options: ["Magnetism", "Friction", "Gravity", "Pressure"], answer: 2 },
      { text: "What is the hardest natural substance on Earth?", options: ["Quartz", "Diamond", "Obsidian", "Titanium"], answer: 1 },
      { text: "How many bones make up the adult human skeleton?", options: ["206", "186", "226", "256"], answer: 0 },
      { text: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"], answer: 3 }
    ]
  },
  history: {
    name: "History",
    topic: "Footprints in time",
    icon: "◒",
    description: "People, places & the moments that shaped us.",
    questions: [
      { text: "Which ancient civilization built Machu Picchu?", options: ["Maya", "Roman", "Inca", "Greek"], answer: 2 },
      { text: "The Renaissance began in which country?", options: ["France", "Italy", "Spain", "England"], answer: 1 },
      { text: "Who was the first person to walk on the Moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], answer: 0 },
      { text: "The Berlin Wall fell in which year?", options: ["1975", "1989", "1991", "1961"], answer: 1 },
      { text: "Which city was buried by Mount Vesuvius?", options: ["Pompeii", "Athens", "Carthage", "Sparta"], answer: 0 }
    ]
  },
  culture: {
    name: "Culture",
    topic: "The human canvas",
    icon: "✳",
    description: "Art, language & the beautiful ways we make meaning.",
    questions: [
      { text: "Who painted the ceiling of the Sistine Chapel?", options: ["Raphael", "Leonardo da Vinci", "Michelangelo", "Donatello"], answer: 2 },
      { text: "Which instrument has 88 keys?", options: ["Violin", "Piano", "Harp", "Organ"], answer: 1 },
      { text: "What is the most spoken language in the world by native speakers?", options: ["English", "Spanish", "Hindi", "Mandarin"], answer: 3 },
      { text: "In which city would you find the Louvre?", options: ["Rome", "Paris", "Madrid", "Vienna"], answer: 1 },
      { text: "What is the name of the Japanese art of paper folding?", options: ["Ikebana", "Origami", "Kabuki", "Sumi-e"], answer: 1 }
    ]
  },
  everyday: {
    name: "Everyday",
    topic: "Useful little things",
    icon: "⌁",
    description: "Food, language & the facts hiding in plain sight.",
    questions: [
      { text: "What is the main ingredient in traditional hummus?", options: ["Lentils", "Chickpeas", "Peas", "Fava beans"], answer: 1 },
      { text: "How many sides does a hexagon have?", options: ["Five", "Six", "Seven", "Eight"], answer: 1 },
      { text: "Which month has an extra day in a leap year?", options: ["January", "February", "March", "December"], answer: 1 },
      { text: "What does the Latin phrase 'carpe diem' mean?", options: ["Know yourself", "Seize the day", "Love conquers all", "Time flies"], answer: 1 },
      { text: "Which spice gives curry its distinctive yellow color?", options: ["Cumin", "Paprika", "Turmeric", "Saffron"], answer: 2 }
    ]
  }
};

const state = {
  screen: "home",
  categoryKey: "science",
  questions: [],
  currentIndex: 0,
  answers: [],
  secondsLeft: QUIZ_TIME,
  timerId: null,
  startedAt: null,
  completedAt: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderCategories() {
  $("#category-list").innerHTML = Object.entries(questionSets).map(([key, category], index) => `
    <button class="category-card ${key === state.categoryKey ? "selected" : ""}" data-category="${key}" aria-pressed="${key === state.categoryKey}">
      <span class="category-icon" aria-hidden="true">${category.icon}</span>
      <span class="category-card-meta">0${index + 1} / 05 Q</span>
      <h3>${category.name}</h3>
      <p class="category-card-description">${category.description}</p>
      <span class="category-card-arrow" aria-hidden="true">↗</span>
    </button>`).join("");

  $$(".category-card").forEach((card) => card.addEventListener("click", () => {
    state.categoryKey = card.dataset.category;
    $$(".category-card").forEach((item) => {
      const selected = item === card;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    startQuiz();
  }));
}

function showScreen(screenName) {
  state.screen = screenName;
  $$(".screen").forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;
    screen.hidden = !isActive;
    screen.classList.toggle("is-active", isActive);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz() {
  clearInterval(state.timerId);
  state.questions = questionSets[state.categoryKey].questions;
  state.currentIndex = 0;
  state.answers = Array(state.questions.length).fill(null);
  state.secondsLeft = QUIZ_TIME;
  state.startedAt = Date.now();
  state.completedAt = null;
  $("#quiz-category-label").textContent = questionSets[state.categoryKey].name;
  $("#question-total").textContent = String(state.questions.length).padStart(2, "0");
  showScreen("quiz");
  renderQuestion();
  startTimer();
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.secondsLeft -= 1;
    updateTimer();
    if (state.secondsLeft <= 0) {
      clearInterval(state.timerId);
      finishOrAdvance(true);
    }
  }, 1000);
  updateTimer();
}

function updateTimer() {
  const value = Math.max(0, state.secondsLeft);
  $("#timer-value").textContent = String(value).padStart(2, "0");
  $("#timer-ring-value").style.strokeDashoffset = String(270.18 * (1 - value / QUIZ_TIME));
  $("#timer-block").classList.toggle("is-warning", value <= 5);
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const answered = state.answers[state.currentIndex];
  const category = questionSets[state.categoryKey];
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
  $("#question-number").textContent = String(state.currentIndex + 1).padStart(2, "0");
  $("#question-topic").textContent = category.topic;
  $("#quiz-title").textContent = question.text;
  $("#progress-value").style.width = `${progress}%`;
  $("#previous-button").disabled = state.currentIndex === 0;
  $("#next-button").innerHTML = state.currentIndex === state.questions.length - 1 ? "Finish <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>" : "Next <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>";
  $("#question-pips").innerHTML = state.questions.map((_, index) => `<span class="question-pip ${index === state.currentIndex ? "is-active" : ""} ${index < state.currentIndex ? "is-done" : ""}"></span>`).join("");
  $("#answers").innerHTML = question.options.map((option, index) => {
    let className = "answer";
    if (answered === index) className += " is-selected";
    return `<button class="${className}" data-answer="${index}" role="radio" aria-checked="${answered === index}"><span class="answer-index">${index + 1}</span><span class="answer-text">${option}</span></button>`;
  }).join("");
  $$(".answer").forEach((answer) => answer.addEventListener("click", () => selectAnswer(Number(answer.dataset.answer))));
  updateTimer();
}

function selectAnswer(answerIndex) {
  if (state.secondsLeft <= 0) return;
  state.answers[state.currentIndex] = answerIndex;
  $$(".answer").forEach((answer) => {
    const selected = Number(answer.dataset.answer) === answerIndex;
    answer.classList.toggle("is-selected", selected);
    answer.setAttribute("aria-checked", String(selected));
  });
}

function finishOrAdvance(timedOut = false) {
  if (timedOut && state.answers[state.currentIndex] === null) {
    showToast(state.currentIndex === state.questions.length - 1
      ? "Time's up — your round is complete."
      : "Time's up — moving to the next question.");
  }
  if (state.currentIndex === state.questions.length - 1) {
    finishQuiz();
    return;
  }
  state.currentIndex += 1;
  state.secondsLeft = QUIZ_TIME;
  renderQuestion();
  startTimer();
}

function finishQuiz() {
  clearInterval(state.timerId);
  state.completedAt = Date.now();
  const category = questionSets[state.categoryKey];
  const correct = state.answers.reduce((total, answer, index) => total + (answer === category.questions[index].answer ? 1 : 0), 0);
  const percent = Math.round((correct / category.questions.length) * 100);
  const bestStreak = calculateBestStreak();
  $("#score-value").textContent = String(correct).padStart(2, "0");
  $("#score-percent").textContent = `${percent}%`; $("#score-bar-value").style.width = `${percent}%`;
  $("#results-category").textContent = category.name;
  $("#correct-count").textContent = String(correct).padStart(2, "0");
  $("#stat-total").textContent = category.questions.length;
  $("#best-streak").textContent = String(bestStreak).padStart(2, "0");
  $("#review-score-label").textContent = `${correct} / ${category.questions.length} correct`;
  $("#results-message").textContent = getResultsMessage(percent);
  $("#takeaway").textContent = getTakeaway(percent);
  const duration = Math.max(0, Math.round((state.completedAt - state.startedAt) / 1000));
  $("#results-time").textContent = `Completed in ${formatTime(duration)}`;
  $("#review-list").innerHTML = category.questions.map((question, index) => {
    const isCorrect = state.answers[index] === question.answer;
    const chosen = state.answers[index] === null ? "No answer" : question.options[state.answers[index]];
    return `<div class="review-item"><span class="review-number">0${index + 1}</span><span class="review-question">${question.text}</span><span class="review-answer ${isCorrect ? "is-correct" : "is-wrong"}">${isCorrect ? "✓ " : "× "}${chosen}</span></div>`;
  }).join("");
  showScreen("results");
}

function calculateBestStreak() {
  const questions = questionSets[state.categoryKey].questions;
  let best = 0; let current = 0;
  state.answers.forEach((answer, index) => {
    if (answer === questions[index].answer) { current += 1; best = Math.max(best, current); } else current = 0;
  });
  return best;
}

function getResultsMessage(percent) {
  if (percent === 100) return "A clean sweep. Your curiosity came prepared.";
  if (percent >= 80) return "Your instincts are getting sharper.";
  if (percent >= 60) return "A solid round — the next layer is waiting.";
  return "Good first pass. Every wrong answer is a new door.";
}

function getTakeaway(percent) {
  if (percent === 100) return "Perfect signal";
  if (percent >= 80) return "Sharp instincts";
  if (percent >= 60) return "Keep exploring";
  return "Stay curious";
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function chooseCategory() {
  clearInterval(state.timerId);
  showScreen("home");
  setTimeout(() => $("#categories").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

$$('[data-action="scroll-categories"]').forEach((button) => button.addEventListener("click", () => $("#categories").scrollIntoView({ behavior: "smooth", block: "start" })));
$$('[data-action="home"]').forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); clearInterval(state.timerId); showScreen("home"); }));
$$('[data-action="quit-quiz"], [data-action="choose-category"]').forEach((button) => button.addEventListener("click", chooseCategory));
$$('[data-action="restart-quiz"]').forEach((button) => button.addEventListener("click", startQuiz));
$("#next-button").addEventListener("click", () => finishOrAdvance(false));
$("#previous-button").addEventListener("click", () => { if (state.currentIndex > 0) { state.currentIndex -= 1; state.secondsLeft = QUIZ_TIME; renderQuestion(); startTimer(); } });
document.addEventListener("keydown", (event) => {
  if (state.screen !== "quiz") return;
  if (["1", "2", "3", "4"].includes(event.key)) selectAnswer(Number(event.key) - 1);
  if (event.key === "Enter" && state.answers[state.currentIndex] !== null) finishOrAdvance(false);
});

renderCategories();
