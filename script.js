// Password Generator Script

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthdisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genrateBtn = document.querySelector(".genrateBtn");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolSet = "!@#$%^&*()_+-=[]{}|;:,.<>?";

let password = "";
let passwordLength = 10;
let checkCount = 0;

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthdisplay.innerText = passwordLength;
}

function setIndicater(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 10px ${color}`;
}

function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomNumber() {
    return getRndInt(0, 10);
}

function getRandomLowercase() {
    return String.fromCharCode(getRndInt(97, 123));
}

function getRandomUppercase() {
    return String.fromCharCode(getRndInt(65, 91));
}

function getRandomSymbol() {
    return symbolSet.charAt(getRndInt(0, symbolSet.length));
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumber = numbersCheck.checked;
    let hasSymbol = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicater("#0f0");
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicater("#ff0");
    } else {
        setIndicater("#f00");
    }
}

async function copyCnt() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyCnt();
    }
});

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRndInt(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function animatePassword() {
    passwordDisplay.classList.add("password-animated");
    setTimeout(() => {
        passwordDisplay.classList.remove("password-animated");
    }, 400);
}

genrateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(getRandomUppercase);
    if (lowercaseCheck.checked) funcArr.push(getRandomLowercase);
    if (numbersCheck.checked) funcArr.push(getRandomNumber);
    if (symbolsCheck.checked) funcArr.push(getRandomSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    animatePassword();
    calcStrength();
});

const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    themeLabel.textContent = themeToggle.checked ? "☀️" : "🌙";
});

handleSlider();
calcStrength();

const togglePasswordBtn = document.getElementById("togglePassword");
togglePasswordBtn.addEventListener("click", () => {
    const input = passwordDisplay;
    if (input.type === "password") {
        input.type = "text";
        togglePasswordBtn.textContent = "🙈";
    } else {
        input.type = "password";
        togglePasswordBtn.textContent = "👁️";
    }
});
