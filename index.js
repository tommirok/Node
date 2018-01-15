const express = require('express');
const app = express();

app.set('view engine','ejs');

app.set("views", __dirname + "/views");

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next)=>{
  console.log(req.headers)
  next();
})

app.use((req, res, next) =>{
  req.chance = Math.random()
  next();
})

app.get('/', (req, res)=>{
  res.render("index")
})
app.post('/shorturl', (req, res) =>{
  res.send("submit here")
})

app.get('/:key', (req, res)=>{



  res.send("your key is: " + req.key)
})


app.listen(app.get('port'), (err) =>{
  if(err){
    return console.log('Something went wrong');
  }

  console.log("server started on: "+ app.get('port'));
});
/*res.json({
  chance: req.chance
})*/
