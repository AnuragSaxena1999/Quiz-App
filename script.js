const question = document.getElementById("question");
const options = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("score");
const _totalQuestion = document.getElementById("total-question");
const checkBtn = document.getElementById("check-answer");
const playAgain = document.getElementById("play-again");
const _result = document.getElementById("result");


let correctAnswer = "" , correctScore = askedCount = 0 ,totalQuestion=10;

function eventListeners(){
    checkBtn.addEventListener("click" , checkAnswer);
    playAgain.addEventListener("click" , restartQuiz);
}

document.addEventListener("DOMContentLoaded" , () =>{
    loadQuestion();
    eventListeners();
    _correctScore.textContent= correctScore;
    _totalQuestion.textContent = totalQuestion;
})

async function loadQuestion(){
    const url = "https://opentdb.com/api.php?amount=1&category=18&difficulty=medium&type=multiple";
    const result = await fetch(url);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
    
}
function showQuestion(data){
    checkBtn.disabled = false;
         correctAnswer = data.correct_answer;
        let incorrectAnswer = data.incorrect_answers;
      let optionList = incorrectAnswer;
      optionList.splice(Math.floor(Math.random()*(incorrectAnswer.length + 1)), 0 , correctAnswer);
      question.innerHTML = `${data.question}`;
      options.innerHTML = `
            ${optionList.map((option , index) =>
                `
            <li> ${index + 1}. <span>${option}</span></li>
           ` ).join('')}
      `;
        selectOption();
      
}
function selectOption(){
    options.querySelectorAll("li").forEach((option)=>{
        option.addEventListener("click" , ()=>{
            if(options.querySelector(".selected")){
                const activeOption = options.querySelector(".selected");
                activeOption.classList.remove("selected");
            }
            option.classList.add("selected");
        })
    })
}
function checkAnswer(){
    checkBtn.disabled = true;
    if(options.querySelector(".selected")){
        let selectAnswer = options.querySelector(".selected span").textContent;
        if(selectAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p> <i class = "fas fa-check"></i> Correct Answer! </p>`
        }else{
            _result.innerHTML = `<p> <i class = "fas fa-times"></i> Incorrect Answer! <p> </p><small><b>Correct Answer: </b>${correctAnswer}</small></p>`
        }
        checkCount();
    }else{
      _result.innerHTML = `<p><i class = "fas fa-question"></i> Please Select an Option!</p>` ;
      checkBtn.disabled = false; 
    }
}
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString , "text/html");
    return doc.documentElement.textContent;
}
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML += `<p>Your Score is : ${correctScore}. </p>`;
        playAgain.style.display= "block";
        checkBtn.style.display="none";
    }else{
        setTimeout(() => {
            loadQuestion();
        }, 3000);
    }
}
function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}
function restartQuiz(){
    correctScore = askedCount = 0;
    playAgain.style.display = "none";
    checkBtn.style.display="block";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
}