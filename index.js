const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
//----------------------------------------------------------\\
const app = express();
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
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use('/',(req,res,next)=>{
  if(!req.session.word){
  let randomWord = Math.floor(Math.random()*(words.length-1));
  req.session.word =words[randomWord];
  //Array(randomword.length).fill('_');
  req.session.blank = Array(req.session.word.length).fill('_');
  console.log(req.session.word);
}
next();
});

app.get('/', (req,res)=>{

  res.render("index",{blank: req.session.blank.join(' ')} )
});
app.post('/guess',(req,res)=>{
  let guess = req.body.guess
  req.session.guess = guess;
  console.log(req.session);
  console.log(req.session.guess);
  console.log(req.session.blank);
  res.redirect('/');
});



app.listen(3000)
