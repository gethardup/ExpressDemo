
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , https = require('https')
  , io = require('socket.io')(https)
  , fs = require("fs")
  //, nodemailer = require ( "nodemailer" )
  , path = require('path');

var app = express();

var admin = express(); // the sub app

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // /admin
  res.send('Admin Homepage');
});

app.use('/admin', admin); // mount the sub app

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use(user.init);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/users', user.save);
//app.get('/about', routes.about);

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
  console.log('a user connected');

  //监听新用户加入
  socket.on('login', function(obj){
    //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
    socket.name = obj.userid;

    //检查在线列表，如果不在里面就加入
    if(!onlineUsers.hasOwnProperty(obj.userid)) {
      onlineUsers[obj.userid] = obj.username;
      //在线人数+1
      onlineCount++;
    }

    //向所有客户端广播用户加入
    io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
    console.log(obj.username+'加入了聊天室');
  });

  //监听用户退出
  socket.on('disconnect', function(){
    //将退出的用户从在线列表中删除
    if(onlineUsers.hasOwnProperty(socket.name)) {
      //退出用户的信息
      var obj = {userid:socket.name, username:onlineUsers[socket.name]};

      //删除
      delete onlineUsers[socket.name];
      //在线人数-1
      onlineCount--;

      //向所有客户端广播用户退出
      io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
      console.log(obj.username+'退出了聊天室');
    }
  });

  //监听用户发布聊天内容
  socket.on('message', function(obj){
    //向所有客户端广播发布的消息
    io.emit('message', obj);
    console.log(obj.username + '说：' + obj.content);
  });

});


var options = {
  key: fs.readFileSync('./certs/privatekey.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
};

https.createServer(options, app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
