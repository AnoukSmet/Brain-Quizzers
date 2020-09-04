

const categorySelectionRef = document.querySelector('#category');
const questionRef = document.querySelector('#question');
const feedbackMessageIncorrectRef = document.querySelector('#incorrect-answer');
const feedbackMessageCorrectRef = document.querySelector('#correct-answer');
const gameRef = document.querySelector('#game');
const welcomeRef = document.querySelector('#welcome');
const endscreenRef = document.querySelector('#endscreen');
const endscoreRef = document.querySelector('#endscore');
const endmessageRef = document.querySelector('#end-message');
const questionCounterRef = document.querySelector('#questionCounter');
const endGameRef = document.querySelector('#end-game');
const playAgainRef = document.querySelector('#play-again');
const scoreRef = document.querySelector('#score');
const startButtonRef = document.querySelector('#submitCategory');
const loaderRef = document.querySelector('#loader');
const errorMessageRef = document.querySelector('#error-message');
const modalRef = document.querySelector('#modal');
const helpBtnRef = document.querySelector('#help');
const closeBtnRef = document.querySelector('#close-btn');
const choices = Array.from(document.querySelectorAll('.choices'));
const pointsCorrectAnswer = 10;
const maximumQuestions = 10;
let questions = [];
let availableQuestions = [];
let questionCounter = 0;
let score = 0;
let acceptingAnswers = false;
let categoryId;
let categories;

/**
 * Fetches the data from the API and converts results to json
*/

const fetchData = (url) => {
    return fetch(url).then(res => res.json())
    .catch(err => {
        errorMessageRef.innerHTML = `Oops it looks like you shouldn't get any smarter. Please refresh the page to try again.`;
        console.error(err);
    });
};

/**
 * Function to retrieve the categories and pass them to the DOM
*/

const fetchedCategories = fetchData("https://opentdb.com/api_category.php");
fetchedCategories.then((result) => {
    categories = result.trivia_categories;
    categories.forEach(category => {
         (categorySelectionRef.options[categorySelectionRef.options.length] = new Option(category.name, category.id));
    });
});


/**
 * Function to retrieve category Id when category is selected 
*/

startButtonRef.addEventListener('click', ()  => {
    if (categorySelectionRef.value === "") { 
        return;
    } else {
        welcomeRef.classList.add('hide');
        loaderRef.classList.remove('hide');
        categoryId = categorySelectionRef.value;
    }
    

/** 
 * Function to retrieve the questions, formats them and passes them to the DOM 
*/

    const fetchedQuestions = fetchData(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`)
    fetchedQuestions.then((fetchedQuestions) => {
        questions = fetchedQuestions.results.map(fetchedQuestion => {
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
        }).catch(err => {
            errorMessageRef.innerHTML = `Oops it looks like you shouldn't get any smarter. Please refresh the page to try again.`;
            console.error(err);
        });
});

/**
 * Sets question counter and score to 0 
 * Defines the questions and get new question
*/

const startGame = () => {
    questionCounter = 0;
    score = 0;
    scoreRef.innerText = score;
    availableQuestions = [... questions];
    getNewQuestion();
    loaderRef.classList.add('hide');
    gameRef.classList.remove('hide');
};

/** 
 * Checks if there are any remaining questions, if yes, gets new question
 * Update the bar for the question counter 
 * Gets next question + choices
*/

const getNewQuestion = () => {
    if (availableQuestions.length === 0){
        endgame();
    } else {
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        loaderRef.classList.add('hide');
        questionCounter++;
        questionCounterRef.innerText = `${(questionCounter / maximumQuestions) * 100 - 10}%`;
        questionCounterRef.style.width = `${(questionCounter / maximumQuestions) * 100 - 10 }%`;
        currentQuestion = availableQuestions[questionIndex];
        questionRef.innerHTML = currentQuestion.question;   
 
        choices.forEach((choice) => {
			const number = choice.dataset.number;
            choice.innerHTML = currentQuestion['choice' + number];
        });
   
        /**
        * Removes the current question from the avail Questions so it will not repeat
        */

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true; 
        validatingAnswers();
    }   
};

/** 
 * Function that is called when there are no questions left
 * Displays personalised message depending on the total score of user 
*/

endgame = () => {
    const maximumScore = maximumQuestions * pointsCorrectAnswer;
    gameRef.classList.add('hide');
    loaderRef.classList.add('hide');
    endscreenRef.classList.remove('hide');
    endscoreRef.innerText = score + " / " + maximumScore;
    if (score === (maximumQuestions * pointsCorrectAnswer)) {
        endmessageRef.innerText = "Congratulations, perfect score!";
    } else if (score >= ((maximumQuestions / 5 * 4 ) * pointsCorrectAnswer)) {
        endmessageRef.innerText = "Congratulations! Almost a perfect score!";
    } else if (score > ((maximumQuestions / 2) * pointsCorrectAnswer)) {
        endmessageRef.innerText = "Congratulations! Above average!";
    } else if (score > ((maximumQuestions/5) * pointsCorrectAnswer)){
        endmessageRef.innerText = "Not bad, try again and beat your own score!";
    } else {
        endmessageRef.innerText = "Please go hit the books!";
    } 
}

/** 
 * Validates the selected answer and highlights either correct or incorrect
 * When answer is correct, thumbs up will be displayed
 * when answer is incorrect, correct answer will be displayed 
 * 2 Time out functions depending on if answer was correct or not. 
 * More time when incorrect so user has enough time to read correct answer
*/

validatingAnswers = () => {
    choices.forEach((choice) => {
        choice.addEventListener("click", event => {
            const clickedChoice = event.target;
            const clickedAnswer = clickedChoice.dataset.number;
            if (!acceptingAnswers) return;
            acceptingAnswers = false;
            
            if (clickedAnswer == currentQuestion.answer) {
                clickedChoice.classList.add('correct');
                feedbackMessageCorrectRef.classList.remove('hide');
                feedbackMessageCorrectRef.innerHTML = `<i class="fas fa-thumbs-up"></i>`;
                increaseScore(pointsCorrectAnswer);
                setTimeout ( () => {
                    clickedChoice.classList.remove('correct');
                    feedbackMessageCorrectRef.classList.add('hide');
                    feedbackMessageCorrectRef.innerText = "";
                    loaderRef.classList.remove('hide');
                    getNewQuestion();
                }, 1500);
            } else {
                const correctAnswer = currentQuestion['choice' + currentQuestion.answer];
                clickedChoice.classList.add('incorrect');
                feedbackMessageIncorrectRef.classList.remove('hide');
                feedbackMessageIncorrectRef.innerHTML = `The correct answer is: <strong>${correctAnswer}</strong>`;
                setTimeout ( () => {
                    clickedChoice.classList.remove('incorrect');
                    feedbackMessageIncorrectRef.classList.add('hide');
                    feedbackMessageIncorrectRef.innerText = "";
                    loaderRef.classList.remove('hide');
                    getNewQuestion();
                }, 3000);
            }
        });
    });
}

/** 
 * Increase score when answer is correct 
*/

increaseScore = num => {
    score += num;
    scoreRef.innerText = score;
};

/**  
 * Functions to return to homepage when button is clicked 
*/ 


endGameRef.addEventListener("click", () => {
    gameRef.classList.add('hide');
    welcomeRef.classList.remove('hide');
});

playAgainRef.addEventListener("click", () => {
    gameRef.classList.add('hide');
    welcomeRef.classList.remove('hide');
    endscreenRef.classList.add('hide');
});

helpBtnRef.addEventListener("click", () => {
    welcomeRef.classList.add('hide');
    modalRef.style.display = "inline-block";
          

});

closeBtnRef.addEventListener("click", () => {
    modalRef.style.display ="none";
    welcomeRef.classList.remove('hide');

})