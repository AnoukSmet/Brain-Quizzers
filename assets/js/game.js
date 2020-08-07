/* Variables */ 

const categorySelectionRef = document.querySelector('#category');
const questionRef = document.querySelector('#question');
const feedbackMessageIncorrectRef = document.querySelector('#incorrect-answer');
const feedbackMessageCorrectRef = document.querySelector('#correct-answer');
// const questionCounterRef = document.querySelector('#questionCounter');
const gameRef = document.querySelector('#game');
const welcomeRef = document.querySelector('#welcome');
const endscreenRef = document.querySelector('#endscreen');
const endscoreRef = document.querySelector('#endscore');
const endmessageRef = document.querySelector('#end-message');
const myBarRef = document.querySelector('#myBarProgress');
const endGameRef = document.querySelector('#end-game');
const playAgainRef = document.querySelector('#play-again');
const scoreRef = document.querySelector('#score');
const startButtonRef = document.querySelector('#submitCategory');
const choices = Array.from(document.querySelectorAll('.choices'));
const pointsCorrectAnswer = 10;
const maximumQuestions = 10;
let questions = [];
let availableQuestions = [];
let displayedQuestion = {};
let questionCounter = 0;
let score = 0;
let acceptingAnswers = false;
let categoryOptions;
let categoryId;

/* Fetching categories from API */

fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
    const categories = data.trivia_categories;

    categories.forEach(category => {
        (categorySelectionRef.options[categorySelectionRef.options.length] = new Option(category.name, category.id)).setAttribute("aria-label",category.name);
        console.log(categorySelectionRef);
});
});

startButtonRef.addEventListener('click', ()  => {
    categoryId = categorySelectionRef.value;
    if (categorySelectionRef.value == "") { 
        return;
    } 
    else {
        categoryId = categorySelectionRef.value;
    };
    gameRef.classList.remove('hide');
    welcomeRef.classList.add('hide');
    
    
/* Fetching questions from API */ 

fetchData = fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`).then( res => res.json() ).then(fetchedAPIQuestions => {
     questions = fetchedAPIQuestions.results.map(fetchedQuestion => {
        formattedQuestion = {
            question : fetchedQuestion.question,
        };

    formattedQuestion.answer = Math.floor(Math.random() * 3 ) + 1;
    const answerChoices = [ ... fetchedQuestion.incorrect_answers];
    answerChoices.splice(formattedQuestion.answer -1, 0, fetchedQuestion.correct_answer);

    answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = choice;
    });

    return formattedQuestion;

    });
    startGame();
    
})
.catch(err => {
    console.error(err);
});
});
/* Start Game function  */


startGame = () => {
        questionCounter = 0;
        score = 0;
        scoreRef.innerText = score;
        availableQuestions = [... questions];
        fetchNewQuestion();
    };
/* fetching new questions and answers */
fetchNewQuestion = () => {
    if (availableQuestions == 0) {
        gameRef.classList.add('hide');
        endscreenRef.classList.remove('hide');
        const maximumScore = maximumQuestions * pointsCorrectAnswer;
        endscoreRef.innerText = score + " / " + maximumScore;
        if (score == (maximumQuestions * pointsCorrectAnswer)) {
            endmessageRef.innerText = "Congratulations, perfect score!";
        } else if (score >= ((maximumQuestions / 2) * pointsCorrectAnswer)) {
            endmessageRef.innerText = "Congratulations! Above average!";
        } else if (score > ((maximumQuestions/5) * pointsCorrectAnswer)){
            endmessageRef.innerText = "Not bad, try again and beat your own score!";
        } else {
            endmessageRef.innerText = "Please go hit the books!";
        } 
    } else {
        questionCounter++;
        myBarRef.innerText = `${(questionCounter / maximumQuestions) * 100 - 10}%`;
        myBarRef.style.width = `${(questionCounter / maximumQuestions) * 100 - 10 }%`;
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        questionRef.innerHTML = currentQuestion.question;   
 
        choices.forEach((choice) => {
			const number = choice.dataset[ 'number' ];
            choice.innerHTML = currentQuestion['choice' + number];
        });

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true; 
    }   
};

/* Validation answers */

choices.forEach((choice) => {
    choice.addEventListener("click", event => {
        if (!acceptingAnswers) return;
        
    acceptingAnswers = false;
    const clickedChoice = event.target;
    const clickedAnswer = clickedChoice.dataset['number'];

    if (clickedAnswer == currentQuestion.answer) {
        clickedChoice.classList.add('correct');
        feedbackMessageCorrectRef.classList.remove('hide')
        feedbackMessageCorrectRef.innerHTML = `<i class="fas fa-thumbs-up"></i>`;
        increaseScore(pointsCorrectAnswer);
        setTimeout ( () => {
            clickedChoice.classList.remove('correct');
            feedbackMessageCorrectRef.classList.add('hide')
            feedbackMessageCorrectRef.innerText = "";
            fetchNewQuestion();}, 1500);
            
    } else {
        clickedChoice.classList.add('incorrect');
        feedbackMessageIncorrectRef.classList.remove('hide');
        const correctAnswer = currentQuestion['choice' + currentQuestion.answer];
        feedbackMessageIncorrectRef.innerHTML = `The correct answer is: <strong>${correctAnswer}</strong>`;
        setTimeout ( () => {
            clickedChoice.classList.remove('incorrect');
            feedbackMessageIncorrectRef.classList.add('hide');
            feedbackMessageIncorrectRef.innerText = "";
            fetchNewQuestion();}, 3000);
        };
    });
});

/* Increase score when answer is correct */

increaseScore = num => {
    score += num;
    scoreRef.innerText = score;
};

/* Functions to return to homepage when button is clicked */ 

endGameRef.addEventListener("click", () => {
    gameRef.classList.add('hide');
    welcomeRef.classList.remove('hide');
});

playAgainRef.addEventListener("click", () => {
    gameRef.classList.add('hide');
    welcomeRef.classList.remove('hide');
    endscreenRef.classList.add('hide');
});