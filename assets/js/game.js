/* Fetching categories from API */

const categorySelection = $('#category');
const question = document.getElementById('question');
const feedbackMessage = document.getElementById('wrong-answer-feedback');
let choices = Array.from(document.getElementsByClassName('choices'));
let questionCounter = 0;
let score = 0;
let availableQuestions = [];
let displayedQuestion = {};

let questions = [];

const pointsCorrectAnswer = 5;
const maximumQuestions = 10;


fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
    const categories = data.trivia_categories;

    categories.forEach(category => {
        let optionField = `<option value="${category.id}">${category.name}</option>`;
        categorySelection.append(optionField);
    
    });

});

/* Fetching questions from API */ 


const fetchData = fetch(`https://opentdb.com/api.php?amount=10&category=9&type=multiple`).then( res => res.json() ).then(fetchedAPIQuestions => {
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

startGame = () => {
        questionCounter = 0;
        score = 0;
        availableQuestions = [... questions];
        fetchNewQuestion();
    };

    fetchNewQuestion = () => {
    questionCounter++;
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


