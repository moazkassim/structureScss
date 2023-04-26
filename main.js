// Select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let SubmitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");

// set options
let currentIndex = 0;
let rightAnswers = 0;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);

      let qCount = questionsObject.length;

      // Create Bullets
      createBullets(qCount);

      // Add questions
      addQuestionData(questionsObject[currentIndex], qCount);

      // click submit button
      SubmitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qCount);
        handleBullets();
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "htmlQuestions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on ";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // creat questions
    let qusetionTitle = document.createElement("h2");
    qusetionTitle.appendChild(document.createTextNode(obj.title));
    quizArea.appendChild(qusetionTitle);

    //create the answers
    for (let i = 1; i < 5; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "questions";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // make first option selected
      if (i === 1) {
        radioInput.checked = true;
      }

      let TheLabel = document.createElement("label");
      TheLabel.htmlFor = `answer_${i}`;
      TheLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(TheLabel);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("qusetion");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rightAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    SubmitButton.remove();
    bullets.remove();
  }
}
