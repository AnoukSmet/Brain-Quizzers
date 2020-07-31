/* Fetching categories from API */
// const cursor = document.getElementsByTagName("body")[0].style.cursor = 'default';

const categorySelection = document.getElementById('category');
const question = document.getElementById('question');
const feedbackMessageIncorrect = document.getElementById('incorrect-answer');
const feedbackMessageCorrect = document.getElementById('correct-answer');
let choices = Array.from(document.getElementsByClassName('choices'));
const questionCounterRef = document.getElementById('questionCounter');
const game = document.getElementById('game');
const welcome = document.getElementById('welcome');
const endscreen = document.getElementById('endscreen');
const endscore = document.getElementById('endscore');
const endmessage = document.getElementById('end-message');
const myBar = document.getElementById('myBarProgress');
const endGame = document.getElementById('end-game');
const playAgain = document.getElementById('play-again');

let questionCounter = 0;
const scoreRef = document.getElementById('score');
let score = 0;
let availableQuestions = [];
let displayedQuestion = {};
let categoryOptions;
const startButton = document.getElementById('submitCategory');
let categoryId;
let acceptingAnswers = false;


let questions = [];

const pointsCorrectAnswer = 10;
const maximumQuestions = 10;


fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
    const categories = data.trivia_categories;

    categories.forEach(category => {
        categorySelection.options[categorySelection.options.length] = new Option(category.name, category.id);
});
});

startButton.addEventListener('click', ()  => {
    categoryId = categorySelection.value;
    if (categorySelection.value == "") { return;} else {
        categoryId = categorySelection.value;
    }
    game.classList.remove('hide');
    welcome.classList.add('hide');
    
    
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

startGame = () => {
        questionCounter = 0;
        score = 0;
        scoreRef.innerText = score;
        availableQuestions = [... questions];
        fetchNewQuestion();
    };

    fetchNewQuestion = () => {
        if (availableQuestions == 0) {
            game.classList.add('hide');
            endscreen.classList.remove('hide');
            const maximumScore = maximumQuestions * pointsCorrectAnswer
            endscore.innerText = score + " / " + maximumScore;
            if (score == (maximumQuestions * pointsCorrectAnswer)) {
                endmessage.innerText = "Congratulations, perfect score!";
            } else if (score >= ((maximumQuestions / 2) * pointsCorrectAnswer)) {
                endmessage.innerText = "Congratulations! Above average!";
            } else if (score > ((maximumQuestions/5) * pointsCorrectAnswer)){
                endmessage.innerText = "Not bad, try again and beat your own score!"
            } else {
                endmessage.innerText = "Please go hit the books!";
            };
        } else {

    questionCounter++;
    myBar.innerText = `${(questionCounter / maximumQuestions) * 100}%`;
    myBar.style.width = `${(questionCounter / maximumQuestions) * 100 }%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;   
 

    choices.forEach((choice) => {
			const number = choice.dataset[ 'number' ];
            choice.innerHTML = currentQuestion['choice' + number];
        });

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true;

    
}
};

choices.forEach((choice) => {

    choice.addEventListener("click", event => {
        if (!acceptingAnswers) return;
    
        acceptingAnswers = false;
    const clickedChoice = event.target;
    const clickedAnswer = clickedChoice.dataset['number'];

    if (clickedAnswer == currentQuestion.answer) {
        
        clickedChoice.classList.add('correct');
        feedbackMessageCorrect.classList.remove('hide')
        feedbackMessageCorrect.innerHTML = `<i class="fas fa-thumbs-up"></i>`;
        increaseScore(pointsCorrectAnswer);
        setTimeout ( () => {
            clickedChoice.classList.remove('correct');
            feedbackMessageCorrect.classList.add('hide')
            feedbackMessageCorrect.innerText = "";
            fetchNewQuestion();}, 1500);
            
    } else {
        clickedChoice.classList.add('incorrect');
        feedbackMessageIncorrect.classList.remove('hide');
        const correctAnswer = currentQuestion['choice' + currentQuestion.answer];
        feedbackMessageIncorrect.innerHTML = `The correct answer is: <strong>${correctAnswer}</strong>`;
        setTimeout ( () => {
            clickedChoice.classList.remove('incorrect');
            feedbackMessageIncorrect.classList.add('hide');
            feedbackMessageIncorrect.innerText = "";
            fetchNewQuestion();}, 3000);
    };
       });
});

increaseScore = num => {
    score += num
    scoreRef.innerText = score;
};

endGame.addEventListener("click", () => {
    game.classList.add('hide');
    welcome.classList.remove('hide');
});

playAgain.addEventListener("click", () => {
    game.classList.add('hide');
    welcome.classList.remove('hide');
    endscreen.classList.add('hide');
})