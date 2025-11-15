const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const voiceSelect = document.getElementById("voiceSelect");

let voices = [];

// ----------- LOAD VOICES ---------------
function loadVoicesCorrectly() {
    return new Promise((resolve) => {
        let id = setInterval(() => {
            voices = speechSynthesis.getVoices();
            if (voices.length !== 0) {
                clearInterval(id);
                resolve(voices);
            }
        }, 200);
    });
}

// ----------- POPULATE DROPDOWN ---------------
async function setupVoices() {
    await loadVoicesCorrectly();

    // Filter only Hindi / Indian English
    const indianVoices = voices.filter(v =>
        v.lang.toLowerCase().includes("hi") || v.lang.toLowerCase().includes("en-in")
    );

    voiceSelect.innerHTML = "";

    if (indianVoices.length === 0) {
        const option = document.createElement("option");
        option.textContent = "No Indian voices available";
        voiceSelect.appendChild(option);
        return;
    }

    indianVoices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    // Auto-select first Indian voice
    voiceSelect.value = 0;
}

setupVoices();
speechSynthesis.onvoiceschanged = setupVoices;

// ---------- SPEAK BUTTON ----------
convertBtn.addEventListener('click', () => {
    const enteredText = text.value.trim();
    const error = document.querySelector('.error-para');

    if (!enteredText) {
        error.textContent = "Please enter text to convert!";
        return;
    }

    error.textContent = "";

    const speechSynth = window.speechSynthesis;
    const newUtter = new SpeechSynthesisUtterance(enteredText);

    const selectedVoice = voices.filter(v =>
        v.lang.toLowerCase().includes("hi") || v.lang.toLowerCase().includes("en-in")
    )[voiceSelect.value];

    if (selectedVoice) newUtter.voice = selectedVoice;

    speechSynth.speak(newUtter);

    convertBtn.textContent = "Sound is Playing...";
    setTimeout(() => {
        convertBtn.textContent = "Play Converted Sound";
    }, 3000);
});

