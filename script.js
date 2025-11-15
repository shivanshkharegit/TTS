const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const voiceSelect = document.getElementById("voiceSelect");

let voices = [];

// ----------- FIXED FUNCTION (WORKS 100%) ---------------
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

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    // Auto-select Indian voice
    const indianIndex = voices.findIndex(v =>
        v.lang.toLowerCase() === "en-in" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("indian")
    );

    if (indianIndex !== -1) {
        voiceSelect.value = indianIndex;
    }
}

setupVoices();

// ---------- SPEAK BUTTON ----------
convertBtn.addEventListener('click', () => {

    const enteredText = text.value;
    const error = document.querySelector('.error-para');

    if (!enteredText.trim()) {
        error.textContent = "Please enter text to convert!";
        return;
    }

    error.textContent = "";

    const speechSynth = window.speechSynthesis;
    const newUtter = new SpeechSynthesisUtterance(enteredText);

    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) newUtter.voice = selectedVoice;

    speechSynth.speak(newUtter);

    convertBtn.textContent = "Sound is Playing...";
    setTimeout(() => {
        convertBtn.textContent = "Play Converted Sound";
    }, 3000);
});
