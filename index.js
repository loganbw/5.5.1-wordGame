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
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.get('/', (req,res)=>{
  res.send("helloooo")
});


app.listen(3000)
