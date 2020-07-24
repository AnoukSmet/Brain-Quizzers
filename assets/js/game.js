/* Fetching categories from API */

const categorySelection = $('#category');
const question = document.getElementById('question');
let choices = Array.from(document.getElementsByClassName('choices'));
let questionCounter = 0;
let score = 0;
let availableQuestions = [];
let displayedQuestion = {};
let i = 0;

let questions = [];

const pointsCorrectAnswer = 5;
const maximumQuestions = 10;

// fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
//     const categories = data.trivia_categories;

//     categories.forEach(category => {
//         let optionField = `<option value="${category.id}">${category.name}</option>`;
//         categorySelection.append(optionField);
//     });

// });

/* Fetching questions from API */ 


const fetchData = fetch(`https://opentdb.com/api.php?amount=10&category=9&type=multiple`).then( res => res.json() ).then(fetchedAPIQuestions => {
     questions = fetchedAPIQuestions.results.map(fetchedQuestion => {
        const formattedQuestion = {
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
    startGame()
})
.catch(err => {
    console.error(err);
});


startGame = () => {
        questionCounter = 0;
        score = 0;
        availableQuestions = questions[i];
        fetchNewQuestion();
    };

fetchNewQuestion = () => {
    questionCounter++;
    i++;
    currentQuestion = availableQuestions.question
    question.innerText = currentQuestion ;

    choices.forEach( choice => {
			const number = choice.dataset[ 'number' ];
            optionChoices = availableQuestions[ 'choice' + number ];
            choice.innerHTML = optionChoices;
            formattedChoices = optionChoices.split();
        } );
        formattedChoices.splice(currentQuestion);
};

choices.forEach((choice) => {
    choice.addEventListener("click", event => {
    const clickedChoice = event.target;
    const clickedAnswer = clickedChoice.dataset['number'];
    fetchNewQuestion()
       });
});


