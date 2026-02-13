/**
 * Password Generator App
 */

console.clear();

// Properties for the Range Slider styling
// Updated 'fill' to match the CSS accent color (#5d68e2)
const sliderProps = {
    fill: "#5d68e2",
    background: "rgba(255, 255, 255, 0.214)",
};

// Selecting DOM Elements
const slider = document.querySelector(".range__slider");
const sliderInput = document.getElementById("slider"); 
const sliderValue = document.querySelector(".length__title");

/**
 * Update the visual "fill" effect of the range slider
 */
function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

// Initialize Slider Logic
if (sliderInput) {
    sliderInput.addEventListener("input", event => {
        applyFill(event.target);
    });
    applyFill(sliderInput);
}

/**
 * Crypto Security Function
 */
function secureMathRandom() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Character Generators
const randomFunc = {
    lower: () => String.fromCharCode(Math.floor(secureMathRandom() * 26) + 97),
    upper: () => String.fromCharCode(Math.floor(secureMathRandom() * 26) + 65),
    number: () => String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48),
    symbol: () => {
        const symbols = '~!@#$%^&*()_+{}":?><;.,';
        return symbols[Math.floor(secureMathRandom() * symbols.length)];
    }
};

// DOM Elements
const resultEl = document.getElementById("result");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy-btn");
const resultContainer = document.querySelector(".result");
const copyInfo = document.querySelector(".result__info.right");
const copiedInfo = document.querySelector(".result__info.left");

let isPasswordGenerated = false;

// Floating Copy Button Logic
resultContainer.addEventListener("mousemove", e => {
    const rect = resultContainer.getBoundingClientRect();
    
    if (isPasswordGenerated) {
        copyBtn.style.opacity = '1';
        copyBtn.style.pointerEvents = 'all';
        copyBtn.style.transform = 'translate(-50%, -50%) scale(1)';
        copyBtn.style.setProperty("--x", `${e.clientX - rect.left}px`);
        copyBtn.style.setProperty("--y", `${e.clientY - rect.top}px`);
    } else {
        copyBtn.style.opacity = '0';
        copyBtn.style.pointerEvents = 'none';
        copyBtn.style.transform = 'translate(-50%, -50%) scale(0)';
    }
});

// Leave container -> Hide button
resultContainer.addEventListener("mouseleave", () => {
    copyBtn.style.opacity = '0';
    copyBtn.style.pointerEvents = 'none';
    copyBtn.style.transform = 'translate(-50%, -50%) scale(0)';
});

// Copy to Clipboard
copyBtn.addEventListener("click", () => {
    const password = resultEl.innerText;
    if (!password || password === "CLICK GENERATE") return;

    navigator.clipboard.writeText(password).then(() => {
        copyInfo.style.transform = "translateY(200%)";
        copyInfo.style.opacity = "0";
        copiedInfo.style.transform = "translateY(0%)";
        copiedInfo.style.opacity = "0.75";
        
        // Reset message after 2 seconds
        setTimeout(() => {
            copyInfo.style.transform = "translateY(0%)";
            copyInfo.style.opacity = "0.75";
            copiedInfo.style.transform = "translateY(200%)";
            copiedInfo.style.opacity = "0";
        }, 2000);
    });
});

// Generate Password Event
generateBtn.addEventListener("click", () => {
    const length = +sliderInput.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;
    
    const password = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    
    if (password) {
        resultEl.innerText = password;
        isPasswordGenerated = true;
        // Reset copy feedback
        copyInfo.style.transform = "translateY(0%)";
        copyInfo.style.opacity = "0.75";
        copiedInfo.style.transform = "translateY(200%)";
        copiedInfo.style.opacity = "0";
    }
});

function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesArr = [];
    if (lower) typesArr.push('lower');
    if (upper) typesArr.push('upper');
    if (number) typesArr.push('number');
    if (symbol) typesArr.push('symbol');

    if (typesArr.length === 0) return "";

    for (let i = 0; i < length; i++) {
        const randomType = typesArr[Math.floor(secureMathRandom() * typesArr.length)];
        generatedPassword += randomFunc[randomType]();
    }

    return generatedPassword;
}

// Checkbox Logic: Prevent unchecking all
function disableOnlyCheckbox() {
    const checkboxes = [uppercaseEl, lowercaseEl, numberEl, symbolEl];
    const checked = checkboxes.filter(el => el.checked);
    
    checkboxes.forEach(el => {
        el.disabled = (checked.length === 1 && el.checked);
    });
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
    el.addEventListener('change', disableOnlyCheckbox);
});