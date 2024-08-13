import { questions } from './datasBase.js';

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

const timerContainer = document.getElementById('timer');
const quizContainer = document.getElementById('quiz');
const scoreContainer = document.getElementById('score');
const restartButton = document.getElementById('recommencer');
const afficheAnwersInvalideResponse = document.getElementById('resultDataInvalide');
let datasResponseInvalide = [];



const showQuestion = (index) => {
  const q = questions[index];
  const questionElement = document.createElement('div');
  questionElement.className = 'question';
  questionElement.innerHTML = `
    <p>Question ${index + 1}: ${q.question}</p>
    <label><input type="radio" name="q${index}" value="a"> ${q.a}</label><br>
    <label><input type="radio" name="q${index}" value="b"> ${q.b}</label><br>
    <label><input type="radio" name="q${index}" value="c"> ${q.c}</label><br>
    <label><input type="radio" name="q${index}" value="d"> ${q.d}</label><br>
  `;
  quizContainer.innerHTML = '';
  quizContainer.appendChild(questionElement);
};

const checkAnswer = (index) => {
  const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
  if (selectedAnswer && selectedAnswer.value === questions[index].answer) {
    score += 5;
    // selectedAnswer.parentNode.classList.add('correct')
    // console.log(selectedAnswer);
  } else {
    console.log(index);
    // console.log(questions[index]);
    datasResponseInvalide.push(questions[index]);
    console.log(datasResponseInvalide);

    
  }
};



const startTimer = (duration) => {
  let timeRemaining = duration;
  timerContainer.textContent = `Temps restant: ${timeRemaining} secondes`;
  timerContainer.classList.remove('hidden');

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerContainer.textContent = `Temps restant: ${timeRemaining} secondes`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerContainer.classList.add('hidden');
      nextQuestion();
    }
  }, 1000);
};



const nextQuestion = () => {
  if (currentQuestionIndex < questions.length) {
    if (currentQuestionIndex > 0) {
      checkAnswer(currentQuestionIndex - 1);
      
    }
    
    showQuestion(currentQuestionIndex);
    currentQuestionIndex++;
    startTimer(10); // 10 secondes
    // setTimeout(nextQuestion, 10000); // 10 secondes
  } else {
    checkAnswer(currentQuestionIndex - 1);
    submitQuiz();
    quizContainer.classList.add('hidden');
    restartButton.classList.remove('hidden');
    restartButton.classList.add('recommencer')
    // restartButton.onclick = restartQuiz

    if (datasResponseInvalide.length) {
      let content = `<h2>Résultat des questions mal repondues</h2>`;
      datasResponseInvalide.forEach((data, idx) => {
        const keyAnwer = data.answer
        content += `
          <p><strong>Question: </strong>${data.question}</p>
          <strong>Réponse correct: ${keyAnwer} - ${data[keyAnwer] }</strong>
          <p class="raison">Raison: ${data.raison}</p>
        `;
       
      });
      
      if (afficheAnwersInvalideResponse) {
        console.log(content);
        afficheAnwersInvalideResponse.innerHTML = content;
        afficheAnwersInvalideResponse.classList.remove('hidden');
      }
      
    }


  }
};

const submitQuiz = () => {
  scoreContainer.textContent = `Votre score: ${score} / ${questions.length * 5}`;
  scoreContainer.classList.remove('hidden');
};

// const restartQuiz = () => {
//   currentQuestionIndex = 0;
//   score = 0;
//   scoreContainer.classList.add('hidden');
//   restartButton.classList.add('hidden');
//   quizContainer.classList.remove('hidden');

//   if (afficheAnwersInvalideResponse) {
//     console.log('-------'+'afficheAnwersInvalideResponse');
//     afficheAnwersInvalideResponse.innerHTML = '';
//     afficheAnwersInvalideResponse.classList.add('hidden');
//   }
//   nextQuestion();
// };

// Lancer le quiz au début
nextQuestion();
