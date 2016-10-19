var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');

var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/socket', function(req, res){
//   res.sendFile(__dirname + '/views/pages/testSession.html');

// });

// io.on('connection', function(socket){
//   console.log('a user connected');
// });


// //For Login Session

// app.use(session({secret: 'ssshhhhh'}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// var sess;

// app.get('/sessionStart',function(req,res){
//   sess = req.session;
//   //Session set when user Request our app via URL
//   if(sess.user) {
//   /*
//   * This line check Session existence.
//   * If it existed will do some action.
//   */
//       res.redirect('/popRequest');
//   }
//   else {
//       res.render('index.html');
//   }
// });

// app.post('/login',function(req,res){
//   sess = req.session;
// //In this we are assigning email to sess.email variable.
// //email comes from HTML page.
//   sess.email=req.body.email;
//   res.end('done');
// });

// //End of Login Session


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

app.get('/popRequest', function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT id, xpos, ypos, status FROM canvas_map_dev WHERE status = 0 order by id asc fetch first 1 rows only', 
    function(err, result) {
      done();
      if (err){ console.error(err); response.send("Error " + err); }
      else{ 

        response.render('pages/dbtest', {results: result.rows} ); 
        
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

app.get('/insertordereddiamond', function(request, response) {

    var x;
    var y;
    x = 26;
    y = 26;
    dList = [];
    dList.push(x);
    dList.push(y);
    y++;

    for(var lvl = 1; lvl < 25; lvl++){
        for(i =0; i<lvl; i++){
            x--;y--;
            dList.push(x);
            dList.push(y);
        }
        for(j =0; j<lvl; j++){
            x++;y--;
            dList.push(x);
            dList.push(y);
        }
        for(i =0; i<lvl; i++){
            x++;y++;
            dList.push(x);
            dList.push(y);
        }
        for(i =0; i<lvl; i++){
            x--;y++;
            dList.push(x);
            dList.push(y);
        }

        y++;

    }

    
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {

  for(var j = 0; j < dList.length / 2; j+=2){
        client.query('INSERT INTO canvas_map_dev (xpos,ypos,bitmap,status) VALUES ($1, $2, $3, $4);', [dList[j], dList[j+1],'test',0]);


  }


  });
});
// inserts many
app.get('/insertorderedspiral', function(request, response) {

    var X = 101;
    var Y = 101;
    var x = 0;
    var y = 0;
    var dx = 0;
    var dy = -1;
    var t = X;
    var maxI = t*t;
    var tList = [];

    for(var i =0; i < maxI; i++){
        if ((-X/2 <= x) && (x <= X/2) && (-Y/2 <= y) && (y <= Y/2)){
            tList.push(x+51);
            tList.push(y+51);
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
        client.query('INSERT INTO canvas_map_dev (xpos,ypos,bitmap,status) VALUES ($1, $2, $3, $4);', [tList[j], tList[j+1],'test',0]);


  }


  });
});


