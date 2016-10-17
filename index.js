var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.post('/postList', function(request, response) {
  var name = request.body.vList +"";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    //client.query("INSERT INTO test_table values($1, $2)", [2, name]);
    client.query('INSERT INTO test_table values($1, $2)', [2, name], function(err, result) {
      done();
      if (err){ console.error(err); response.send("Error " + err); }
      else{ client.query('SELECT * FROM test_table', function(err, result) {
          done();
          if (err)
          { console.error(err); response.send("Error " + err); }
          else
          { response.render('pages/db', {results: result.rows} ); }
       });
      }
    });
  });
});

app.get('/request', function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT xpos,ypos FROM canvas_map', function(err, result) {
      done();
      if (err){ console.error(err); response.send("Error " + err); }
      else{ 
        response.render('pages/dbtest', {results: result.rows} ); 
        
      }
    });
  });
});

// inserts many
app.get('/insertordered', function(request, response) {

    var X = 11;
    var Y = 11;
    var x = 0;
    var y = 0;
    var dx = 0;
    var dy = -1;
    var t = X;
    var maxI = t*t;
    var tList = [];

    for(var i =0; i < maxI; i++){
        if ((-X/2 <= x) && (x <= X/2) && (-Y/2 <= y) && (y <= Y/2)){
            tList.push(x+5);
            tList.push(y+5);
        }
        if( (x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))){
            t = dx;
            dx = -dy;
            dy = t;
        }
        x += dx;
        y += dy;
    }
    
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {

  for(var j = 0; j < tList.length / 2; j+=2){
        client.query('INSERT INTO canvas_map (xpos,ypos,bitmap,status) VALUES ($1, $2, $3, $4);', [tList[j], tList[j+1],'test',0]);


  }


  });
});


