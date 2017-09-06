//express
const express = require('express');
const app = express();

//mustache
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//css-static
app.use(express.static("public"));

//session
const session = require('express-session');
app.use(session({
  secret: 'keyboard gunther',
  resave: false,
  saveUninitialized: true
}));

//fs
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

let assets={
  word: fetchWord(), //the actual word
  letter:[],  //the letters that are guessed by the player
  guesses:8,  //total allowed guesses
  // correctGuess:[],
  // wrongGuess:[],
  display:[],  //the way the word will be displayed on player screen
  message:"",  //end message
  result:""   //end result: win or lose
};

app.get('/', function(req, res) {
  // console.log("here");
  assets.display = newGame(assets.word, assets.letter);
  // console.log("here");
  if (gameover(res)){
    res.render("end", assets);
  } else {
    res.render("index", assets);
  }
})

app.post("/", function(req,res){
  if (gameover()){
    assets = startNewGame();
    res.redirect("/");
  } else {
    console.log(req.body);
    assets.letter.push(req.body.guess);
    countLetters(req.body.guess);
    res.redirect('/');
  }
})

function fetchWord(){
  let word = words[Math.floor(Math.random()*words.length)];
  return word;
}

  function newGame(word,letters){
  // console.log("here");
  let display= [];
  for (let i=0; i<word.length; i++){
    if(letters.includes(word[i])){
      display.push(word[i]);
    } else {
      display.push("_");
    }
  }
  return display;
}

function countLetters(theWord){
  let splitWord = assets.word.split("");
  if(!splitWord.includes(theWord)) {
    assets.guesses--;
  }

}

function gameover(){
    if (assets.guesses===0){
      assets.message="Sorry! No more guesses available!";
      assets.result="Lose!!!";
      return true;
    }
    else if(!assets.display.includes("_")){
      assets.message="Kudos! You found the word!";
      assets.result="Win!!!";
      return true;
    }
    else{
      return false;
    }
}

function startNewGame(){
  let newAssets={
    word: fetchWord(),
    letter:[],
    guesses:8,
    correctGuess:[],
    wrongGuess:[],
    display:[],
    message:"",
    result:""
  };
  return newAssets;
}

app.get("/", function (req,res){
  res.render("index");
})

app.listen(3000, function() {
  console.log("Hangman Started...");
  console.log(assets.word);
});
