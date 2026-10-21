/*
  SETUP:
  1) Create a form at https://formspree.io/
  2) Copy your form endpoint, e.g. https://formspree.io/f/abcdwxyz
  3) Paste it into FORMSPREE_ENDPOINT below.
  This project is connected to your Formspree endpoint. Test a submission before sharing the site.
*/
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkzeqyb";
const HER_NAME = "beautiful"; // Personalize this if you'd like.

const questions = [
  { icon: "🌷", category: "THE CUTE STUFF", text: "What's your idea of a perfect date?", hint: "Choose the answer that feels most like you.", answers: ["🌅 Watching the sunset together", "🍦 Ice cream and a long walk", "🕯️ A cozy dinner somewhere cute", "🎡 A fun little adventure"] },
  { icon: "💗", category: "GETTING TO KNOW YOU", text: "What do you notice first about someone?", hint: "First impressions count… sometimes 👀", answers: ["😊 Their smile", "✨ Their personality", "😂 Their sense of humour", "💬 How they talk to people"] },
  { icon: "💌", category: "LOVE LANGUAGE", text: "What makes you feel most appreciated?", answers: ["💬 Sweet messages and kind words", "⏰ Quality time together", "🎁 Thoughtful little surprises", "🫂 Hugs and affection"] },
  { icon: "🌸", category: "LITTLE THINGS", text: "What's a small thing that can make your whole day better?", answers: ["A good morning text ☀️", "Someone remembering the little details 🥹", "A funny message 😂", "An unexpected compliment 🌷"] },
  { icon: "🎀", category: "DATE VIBES", text: "Pick our imaginary first date vibe:", answers: ["🌷 Cute café and lots of talking", "🌅 Sunset and deep conversations", "🎳 Games, laughs, and friendly competition", "🍿 Snacks and a movie"] },
  { icon: "🦋", category: "A LITTLE ROMANCE", text: "Which gesture would make you smile the most?", answers: ["🌹 Receiving flowers", "📝 A handwritten note", "🍫 A favourite snack as a surprise", "💭 Someone remembering something I said"] },
  { icon: "✨", category: "YOUR HEART", text: "What matters most to you when getting close to someone?", answers: ["🤝 Honesty", "😂 Feeling like I can be myself", "🫶 Feeling cared for", "💬 Being able to talk about anything"] },
  { icon: "🌙", category: "DREAMY QUESTIONS", text: "If you could escape for one day, where would you go?", answers: ["🏝️ Somewhere by the ocean", "🌲 A peaceful place in nature", "🏙️ A cute city adventure", "🏡 Somewhere cosy with my favourite person"] },
  { icon: "💕", category: "US, MAYBE?", text: "What's something you'd want to do with someone special?", answers: ["Make cute memories 📸", "Talk for hours 💬", "Try new things together 🌍", "Laugh at absolutely everything 😂"] },
  { icon: "💗", category: "ONE LAST QUESTION", text: "Would you let me take you on a date sometime?", hint: "Be honest — no pressure at all. 💗", answers: ["❤️ Yes, I'd love to!", "🌸 Tell me what you have planned!", "🙈 Maybe… let's see", "🫶 I'd like to get to know you more first"] }
];

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const ending = document.getElementById("ending");
const thanks = document.getElementById("thanks");
const questionText = document.getElementById("questionText");
const questionIcon = document.getElementById("questionIcon");
const category = document.getElementById("category");
const questionHint = document.getElementById("questionHint");
const answersEl = document.getElementById("answers");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const otherWrap = document.getElementById("otherWrap");
const otherAnswer = document.getElementById("otherAnswer");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const submitStatus = document.getElementById("submitStatus");

let currentIndex = 0;
const responses = Array(questions.length).fill(null);
document.getElementById("herName").textContent = HER_NAME;

document.getElementById("startBtn").addEventListener("click", () => {
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  renderQuestion();
});
backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    saveCurrentResponse();
    currentIndex--;
    renderQuestion();
  }
});
nextBtn.addEventListener("click", () => {
  saveCurrentResponse();
  if (!responses[currentIndex] || (!responses[currentIndex].choice && !responses[currentIndex].other)) {
    alert("Pick an answer first, or add your own answer. 💗");
    return;
  }
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    quiz.classList.add("hidden");
    ending.classList.remove("hidden");
  }
});

function renderQuestion() {
  const q = questions[currentIndex];
  questionIcon.textContent = q.icon;
  category.textContent = q.category;
  questionText.textContent = q.text;
  questionHint.textContent = q.hint || "Choose the answer that feels most like you.";
  progressLabel.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  backBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
  nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish questions ♡" : "Next question →";
  answersEl.innerHTML = "";
  q.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer" + (responses[currentIndex]?.choice === answer ? " selected" : "");
    button.textContent = answer;
    button.addEventListener("click", () => {
      answersEl.querySelectorAll(".answer").forEach((b) => b.classList.remove("selected"));
      button.classList.add("selected");
      responses[currentIndex] = { choice: answer, other: responses[currentIndex]?.other || "" };
      otherWrap.classList.remove("hidden");
      otherAnswer.value = responses[currentIndex].other;
    });
    answersEl.appendChild(button);
  });
  otherWrap.classList.remove("hidden");
  otherAnswer.value = responses[currentIndex]?.other || "";
  otherAnswer.placeholder = "Or add a little note (optional)…";
  otherAnswer.oninput = () => {
    if (!responses[currentIndex]) responses[currentIndex] = { choice: "", other: "" };
    responses[currentIndex].other = otherAnswer.value;
  };
}
function saveCurrentResponse() {
  const existing = responses[currentIndex] || { choice: "", other: "" };
  existing.other = otherAnswer.value.trim();
  responses[currentIndex] = existing;
}

submitBtn.addEventListener("click", async () => {
  saveCurrentResponse();
  const nickname = document.getElementById("herNickname").value.trim();
  const payload = {
    nickname: nickname || "Not provided",
    submitted_at: new Date().toISOString(),
    ...Object.fromEntries(questions.map((q, i) => [
      `Q${i + 1}: ${q.text}`,
      [responses[i]?.choice || "No option selected", responses[i]?.other ? `Her note: ${responses[i].other}` : ""].filter(Boolean).join(" — ")
    ]))
  };

  if (!FORMSPREE_ENDPOINT) {
    submitStatus.textContent = "Demo mode: answers are not being sent yet. Add your Formspree endpoint in script.js to receive them.";
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending… 💌";
  submitStatus.textContent = "";
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Submission failed");
    ending.classList.add("hidden");
    thanks.classList.remove("hidden");
  } catch (error) {
    submitStatus.textContent = "Couldn't send just now. Please check your connection and try again.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Try sending again 💗";
  }
});
