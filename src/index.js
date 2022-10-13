import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from "./wordsList.json";
// El $ siempre va despues del nombre en el observable, es un standard de RxJS
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
const letterRows = document.getElementsByClassName("letter-row");
const rightWord = getRandomWord();
const userWinOrLoose$ = new Subject();
let userHasWon = false;
console.log(rightWord);

function getRandomWord() {
  return WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
}

function getLetterBox(letterRowIndex, letterIndex) {
  return Array.from(letterRows)[letterRowIndex].children[letterIndex];
}

function deleteLetter() {
  if (letterIndex > 0) {
    letterIndex -= 1;
  }
  const letterBox = getLetterBox(letterRowIndex, letterIndex);
  letterBox.innerHTML = null;
}

function setLetter(event) {
  if (letterIndex === 5) {
    return;
  }
  const letterBox = getLetterBox(letterRowIndex, letterIndex);
  letterBox.innerHTML = event.key;
  letterBox.classList.add("filled-letter");
  letterIndex += 1;
}

function isAlphabetLetter(pressedKey) {
  const letterMatches = pressedKey.match(/[a-z]/i);
  console.log(letterMatches && pressedKey.length === letterMatches.length);
  return letterMatches && pressedKey.length === letterMatches.length;
}

function submitWord() {
  if (letterRowIndex === 5) {
    return;
  }
  letterRowIndex += 1;
  letterIndex = 0;
}

function isUserWordRightWord(element, rightWordAsArray, index) {
  return (
    element.innerHTML.toUpperCase() === rightWordAsArray[index].toUpperCase()
  );
}

function isLetterInRightWord(rightWordAsArray, element) {
  return rightWordAsArray.includes(element.innerHTML.toUpperCase());
}

const checkWord = {
  next: (event) => {
    if (userHasWon) {
      return;
    }
    if (event.key === "Enter") {
      userWinOrLoose$.next("verify");
    }
  },
};

const insertLetter = {
  next: (event) => {
    if (userHasWon) {
      return;
    }
    const pressedKey = event.key.toUpperCase();
    switch (pressedKey) {
      case "BACKSPACE":
        deleteLetter();
        break;
      default:
        if (isAlphabetLetter(pressedKey)) {
          setLetter(event);
        }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);

userWinOrLoose$.subscribe(() => {
  const wordChildren = Array.from(letterRows)[letterRowIndex].children;
  const rightWordAsArray = rightWord.split("");
  let numberOfMatches = 0;
  Array.from(wordChildren).forEach((element, index) => {
    if (isUserWordRightWord(element, rightWordAsArray, index)) {
      element.classList.add("letter-green");
      numberOfMatches += 1;
    } else if (isLetterInRightWord(rightWordAsArray, element)) {
      element.classList.add("letter-yellow");
    } else {
      element.classList.add("letter-gray");
    }
  });
  submitWord();
  if (numberOfMatches === rightWordAsArray.length) {
    alert("ganaste");
    userHasWon = true;
  }
});
