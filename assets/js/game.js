/* Fetching categories from API */

const categorySelection = $('#category');
const question = $('#question');
let questionCounter = 0;
let score = 0;
let availableQuestions = [];

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


fetch(`https://opentdb.com/api.php?amount=10&category=9`).then(res => res.json()).then(loadedQuestions => {
     questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

    const answerChoices = [ ... loadedQuestion.incorrect_answers];
    formattedQuestion.answer = Math.floor(Math.random() * 3 ) + 1;
    answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

    answerChoices.forEach((choice, index) => {
        formattedQuestion["choice", (index + 1)] = choice;
    });

    return formattedQuestion;
    })
    startGame();
})
.catch((err) => {
    console.error(err);
});

startGame = () => {
        questionCounter = 0;
        score = 0;
        availableQuestions = [... questions];
        console.log(availableQuestions);
    }

startGame()