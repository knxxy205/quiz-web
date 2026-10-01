const questionSets = {
  dasar: {
    name: "Dasar Jaringan",
    topic: "Fondasi konektivitas",
    icon: "⌁",
    description: "Konsep inti tentang cara perangkat saling terhubung.",
    questions: [
      { text: "Apa yang dimaksud dengan jaringan komputer?", options: ["Satu komputer tanpa koneksi", "Kumpulan perangkat yang saling terhubung", "Program untuk mengedit dokumen", "Kabel listrik di dalam gedung"], answer: 1 },
      { text: "Jaringan yang mencakup area kecil seperti rumah atau kantor disebut...", options: ["LAN", "WAN", "MAN", "PAN"], answer: 0 },
      { text: "Topologi jaringan yang semua perangkatnya terhubung ke satu perangkat pusat disebut...", options: ["Bus", "Ring", "Star", "Mesh"], answer: 2 },
      { text: "Apa fungsi utama alamat IP pada jaringan?", options: ["Mengatur warna kabel", "Mengidentifikasi perangkat", "Mempercepat kipas komputer", "Mengganti nama pengguna"], answer: 1 },
      { text: "Istilah untuk kapasitas maksimal transfer data pada jaringan adalah...", options: ["Bandwidth", "Latency", "Hostname", "Gateway"], answer: 0 }
    ]
  },
  perangkat: {
    name: "Perangkat Jaringan",
    topic: "Mengenal perangkat",
    icon: "◒",
    description: "Router, switch, modem, dan perangkat penghubung lainnya.",
    questions: [
      { text: "Perangkat yang menghubungkan dua jaringan atau lebih disebut...", options: ["Monitor", "Router", "Keyboard", "Printer"], answer: 1 },
      { text: "Apa fungsi utama switch dalam jaringan lokal?", options: ["Menghubungkan perangkat dalam satu LAN", "Mengubah listrik menjadi sinyal radio", "Menyimpan cadangan file", "Mendinginkan server"], answer: 0 },
      { text: "Perangkat yang menyediakan koneksi Wi-Fi untuk perangkat nirkabel disebut...", options: ["Access point", "Repeater listrik", "Patch panel", "Kartu suara"], answer: 0 },
      { text: "Perangkat yang mengubah sinyal dari ISP agar dapat digunakan perangkat di rumah adalah...", options: ["Modem", "Switch", "Hub USB", "Firewall"], answer: 0 },
      { text: "Kartu jaringan pada komputer biasanya dikenal dengan singkatan...", options: ["NIC", "CPU", "RAM", "GPU"], answer: 0 }
    ]
  },
  protokol: {
    name: "Protokol Internet",
    topic: "Bahasa komunikasi data",
    icon: "✳",
    description: "DNS, HTTP, TCP, dan aturan yang membuat internet bekerja.",
    questions: [
      { text: "Protokol yang menerjemahkan nama domain menjadi alamat IP adalah...", options: ["FTP", "DNS", "SSH", "SMTP"], answer: 1 },
      { text: "Protokol yang umum digunakan untuk membuka halaman web adalah...", options: ["HTTP", "DHCP", "IMAP", "ARP"], answer: 0 },
      { text: "Versi aman dari HTTP yang menggunakan enkripsi adalah...", options: ["HTML", "HTTPS", "HTMX", "HSTS"], answer: 1 },
      { text: "Protokol yang membantu pengiriman data secara andal dan berurutan adalah...", options: ["UDP", "TCP", "IPX", "ICMP"], answer: 1 },
      { text: "Protokol yang membagikan alamat IP secara otomatis kepada perangkat adalah...", options: ["DHCP", "DNS", "NTP", "FTP"], answer: 0 }
    ]
  },
  keamanan: {
    name: "Keamanan Jaringan",
    topic: "Menjaga koneksi tetap aman",
    icon: "✦",
    description: "Kebiasaan dan teknologi untuk melindungi data jaringan.",
    questions: [
      { text: "Sistem yang menyaring lalu lintas jaringan berdasarkan aturan keamanan disebut...", options: ["Firewall", "Compiler", "Load balancer", "File manager"], answer: 0 },
      { text: "Upaya menipu pengguna agar memberikan data rahasia melalui pesan palsu disebut...", options: ["Phishing", "Caching", "Routing", "Streaming"], answer: 0 },
      { text: "Manakah contoh kata sandi yang paling kuat?", options: ["12345678", "password", "Budi2000", "N7!qL2@vP9#x"], answer: 3 },
      { text: "Teknologi yang membuat koneksi Wi-Fi lebih terlindungi adalah...", options: ["WPA2 atau WPA3", "Nama jaringan terbuka", "FTP anonim", "Kabel tanpa pelindung"], answer: 0 },
      { text: "Apa manfaat utama VPN?", options: ["Mengenkripsi koneksi melalui jaringan", "Menambah kapasitas RAM", "Memperbaiki layar rusak", "Menghapus semua virus secara otomatis"], answer: 0 }
    ]
  }
};

const state = {
  screen: "home",
  categoryKey: "dasar",
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
      <span class="category-card-meta">0${index + 1} / 05 SOAL</span>
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
  $("#next-button").innerHTML = state.currentIndex === state.questions.length - 1 ? "Selesai <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>" : "Lanjut <span class=\"button-arrow\" aria-hidden=\"true\">↗</span>";
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
      ? "Waktu habis — sesi kuismu selesai."
      : "Waktu habis — lanjut ke soal berikutnya.");
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
  $("#review-score-label").textContent = `${correct} / ${category.questions.length} benar`;
  $("#results-message").textContent = getResultsMessage(percent);
  $("#takeaway").textContent = getTakeaway(percent);
  const duration = Math.max(0, Math.round((state.completedAt - state.startedAt) / 1000));
  $("#results-time").textContent = `Selesai dalam ${formatTime(duration)}`;
  $("#review-list").innerHTML = category.questions.map((question, index) => {
    const isCorrect = state.answers[index] === question.answer;
    const chosen = state.answers[index] === null ? "Tidak dijawab" : question.options[state.answers[index]];
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
  if (percent === 100) return "Sempurna. Pemahaman jaringanmu sangat siap.";
  if (percent >= 80) return "Pemahamanmu tentang jaringan makin tajam.";
  if (percent >= 60) return "Sesi yang solid — masih ada lapisan berikutnya.";
  return "Awal yang baik. Setiap jawaban salah membuka pengetahuan baru.";
}

function getTakeaway(percent) {
  if (percent === 100) return "Sinyal sempurna";
  if (percent >= 80) return "Insting tajam";
  if (percent >= 60) return "Terus belajar";
  return "Tetap ingin tahu";
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
