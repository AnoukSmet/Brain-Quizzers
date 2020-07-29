/* Fetching categories from API */

const categorySelection = $('#category');
const question = document.getElementById('question');
const feedbackMessage = document.getElementById('wrong-answer-feedback');
let choices = Array.from(document.getElementsByClassName('choices'));
const questionCounterRef = document.getElementById('questionCounter');
const game = document.getElementById('game');
const welcome = document.getElementById('welcome');
const endscreen = document.getElementById('endscreen');
const endscore = document.getElementById('endscore');
const endmessage = document.getElementById('end-message');
let questionCounter = 0;
const scoreRef = document.getElementById('score');
let score = 0;
let availableQuestions = [];
let displayedQuestion = {};
let categoryOptions;
const startButton = document.getElementById('submitCategory');
let categoryId;

let questions = [];

const pointsCorrectAnswer = 10;
const maximumQuestions = 10;


fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
    const categories = data.trivia_categories;

    categories.forEach(category => {
        let optionField = `<option value="${category.id}">${category.name}</option>`;
        categorySelection.append(optionField);
        // let categoryName = category.name;
        // let categoryId = category.id;
        // categoryOptions = categorySelection.append(`<option value="${category.id}">${category.name}</option>`);
        // console.log(categoryOptions.val());
});
});

console.log(startButton);

startButton.addEventListener('click', ()  => {
    categoryChosen =  $("#category option:selected").val(); 
    categoryId = parseInt(categoryChosen);
    game.classList.remove('hide');
    welcome.classList.add('hide');
    console.log(categoryId);
    
/* Fetching questions from API */ 

console.log(categoryId);
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
            endscore.innerText = score;
            if (score == (maximumQuestions * pointsCorrectAnswer)) {
                endmessage.innerText = "Congratulations, perfect score!";
            } else if (score >= ((maximumQuestions / 2) * pointsCorrectAnswer)) {
                endmessage.innerText = "Congratulations! Above average!";
            } else if (score > ((maximumQuestions/5) * pointsCorrectAnswer)){
                endmessage.innerText = "Not bad, try again and beat your own score!"
            } else {
                endmessage.innerText = "Please go hit the books!";
            };

        }

    questionCounter++;
    questionCounterRef.innerText = questionCounter + " / " + maximumQuestions;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    

    choices.forEach((choice) => {
			const number = choice.dataset[ 'number' ];
            choice.innerText = currentQuestion['choice' + number];
            // console.log(currentQuestion['choice' + 2]);
        });

        availableQuestions.splice(questionIndex, 1);
    
};

choices.forEach((choice) => {
    choice.addEventListener("click", event => {
    const clickedChoice = event.target;
    const clickedAnswer = clickedChoice.dataset['number'];

    if (clickedAnswer == currentQuestion.answer) {
        clickedChoice.classList.add('correct');
        increaseScore(pointsCorrectAnswer);
        setTimeout ( () => {
            clickedChoice.classList.remove('correct');
            fetchNewQuestion();}, 1000);
            
    } else {
        clickedChoice.classList.add('incorrect');
        feedbackMessage.classList.add('show')
        const correctAnswer = currentQuestion['choice' + currentQuestion.answer];
        feedbackMessage.innerHTML = `The correct answer is: <strong>${correctAnswer}</strong>`;
        setTimeout ( () => {
            clickedChoice.classList.remove('incorrect');
            feedbackMessage.innerText = "";
            fetchNewQuestion();}, 3000);
    };
       });
});

increaseScore = num => {
    score += num
    scoreRef.innerText = score;
};
