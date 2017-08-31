const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
//----------------------------------------------------------\\
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const app = express();
app.use('/static',express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressValidator());
app.use(morgan('combined'));
app.use(session({
  secret:"mySecretKeyFromTheMovieAladin",
  resave: false,
  saveUninitialized: true
}));


app.use('/', (req, res, next) => {



if (!req.session.word){
  let randomize = Math.floor((Math.random()*(words.length-1)));
  let randomWord = words.filter(word => word.length > 3)[randomize].split('');
  req.session.word = randomWord;
  req.session.letter = Array(req.session.word.length).fill('_');
  req.session.guess = [];
  }
next();
});



app.get('/', (req,res)=>{
  let hWord = req.session.word.join('');
  let hLetter = req.session.letter.join('');
  let guessesLeft = req.session.guess.length;
    if(guessesLeft === 8){
      return res.render("loss", {hWord: hWord});
    }else if (hLetter === hWord && hWord != []){
      return res.render("winner", {hWord: hWord});
    };
  res.render("index",{letterArray: req.session.letter, guesses: req.session.guess});
});



app.post('/guess',(req,res)=>{
  if (req.session.word.includes(req.body.guessInput) == true
    && req.session.letter.includes(req.body.guessInput) == false){
    for (var i = 0; i < req.session.word.length; i++){
    if (req.session.word[i] == req.body.guessInput){
      req.session.letter.fill(req.body.guessInput, i, i + 1);

        };
      };
      res.redirect('/');
    }else if (req.session.letter.includes(req.body.guessInput)) {
      return res.redirect('/');
    }else{
      req.session.guess.push(req.body.guessInput);
      return res.redirect('/');
    };

});



app.listen(3000)
