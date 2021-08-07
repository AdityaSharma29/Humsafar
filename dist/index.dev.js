"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var express = require('express');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var fs = require('fs');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var path = require('path');

var multer = require('multer');

var upload_post_images = multer({
  storage: multer.diskStorage({
    destination: './assets/users_data/posts_images/',
    filename: function filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});
var upload_profile_image = multer({
  storage: multer.diskStorage({
    destination: './assets/users_data/profile_images/',
    filename: function filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/assets', express["static"]('assets'));
app.get('/', function (req, res) {
  if (req.cookies.token) res.render('home-user');else res.render('home-visiter');
});
app.get('/register', function (req, res) {
  if (req.cookies.token) res.redirect('/');else res.render('register');
});
app.get('/login', function (req, res) {
  if (req.cookies.token) res.redirect('/');else res.render('login');
});
app.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/');
});
app.get('/profile', function (req, res) {
  if (req.cookies.token) {
    var user = jwt.verify(req.cookies.token, "supersecretkey");
    res.redirect("/".concat(user.username, "/profile"));
  } else res.render('login');
});
app.get('/:username/profile', function (req, res) {
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var user_data = JSON.parse(data);
      var index = user_data.findIndex(function (ele) {
        return ele.username === req.params.username;
      });
      if (index == -1) res.status(404).send({
        statusCode: 404,
        message: "oops !! User not found !!"
      });else {
        if (req.cookies.token) {
          var user = jwt.verify(req.cookies.token, "supersecretkey");
          if (user.username == req.params.username) res.render('profile-user');else res.render('profile-visiter');
        } else res.render('profile-visiter');
      }
    }
  });
});
app.get('/:username/profile/edit', function (req, res) {
  if (req.cookies.token) {
    var user = jwt.verify(req.cookies.token, "supersecretkey");

    if (user.username == req.params.username) {
      res.render('edit-profile');
    } else res.send({
      statusCode: 401,
      message: "oops !! You are not authorized !!"
    });
  } else res.send({
    statusCode: 401,
    message: "oops !! You are not authorized !!"
  });
});
app.get('/compose', function (req, res) {
  if (req.cookies.token) res.render('compose');else res.render('login');
});
app.get('/post/:post_id', function (req, res) {
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var post_data = JSON.parse(data);
      var index = post_data.findIndex(function (ele) {
        return ele.post_id == req.params.post_id;
      });
      if (index == -1) res.status(404).send({
        statusCode: 404,
        message: "oops !! post not found !!"
      });else {
        var count = post_data[index].views;
        post_data[index].views = count + 1;
        fs.writeFile('./assets/users_data/posts.json', JSON.stringify(post_data, null, 2), 'utf8', function (err) {
          if (err) throw err;
        });
        if (req.cookies.token) res.render('post-page-users');else res.render('post-page-visitors');
      }
    }
  });
});
app.get('/post/:post_id/like', function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var index = db_post_data.findIndex(function (element) {
        return element.username == user.username;
      });
      db_post_data[index].liked_posts.push(req.params.post_id);
      fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;
      });
    }
  });
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var index = db_post_data.findIndex(function (element) {
        return element.post_id == req.params.post_id;
      });
      var count = db_post_data[index].likes;
      db_post_data[index].likes = count + 1;
      console.log(count + 1);
      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;else {
          console.log({
            statusCode: 200,
            message: "updated"
          });
          res.send({});
        }
      });
    }
  });
});
app.get('/post/:post_id/dislike', function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var user_index = db_post_data.findIndex(function (element) {
        return element.username == user.username;
      });
      var pid_index = db_post_data[user_index].liked_posts.indexOf(req.params.post_id);
      db_post_data[user_index].liked_posts.splice(pid_index, 1);
      fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;
      });
    }
  });
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var index = db_post_data.findIndex(function (element) {
        return element.post_id == req.params.post_id;
      });
      var count = db_post_data[index].likes;
      db_post_data[index].likes = count - 1;
      console.log(count - 1);
      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;else {
          console.log({
            statusCode: 200,
            message: "updated"
          });
          res.send({});
        }
      });
    }
  });
});
app.get('/post/:post_id/report', function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var index = db_post_data.findIndex(function (element) {
        return element.username == user.username;
      });
      db_post_data[index].reported_posts.push(req.params.post_id);
      fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;
      });
    }
  });
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var db_post_data = JSON.parse(data);
      var index = db_post_data.findIndex(function (element) {
        return element.post_id == req.params.post_id;
      });
      var count = db_post_data[index].reports;
      db_post_data[index].reports = count + 1;
      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(db_post_data, null, 2), 'utf8', function (err) {
        if (err) throw err;else {
          console.log({
            statusCode: 200,
            message: "updated"
          });
          res.send({});
        }
      });
    }
  });
});
app.post('/validate', function (request, response) {
  var user = request.body.user;
  var pass = request.body.pass;
  var remember = request.body.remember;
  fs.readFile('./assets/users_data/auth.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var obj = JSON.parse(data);
      var check = obj.find(function (element) {
        return element.username == user;
      });

      if (check === undefined) {
        console.log({
          statusCode: 404,
          message: "oops !! User not found !!"
        });
        response.status(404).send({
          statusCode: 404,
          message: "oops !! User not found !!"
        });
      } else {
        var Dbpass = check.password;
        bcrypt.compare(pass, Dbpass, function (err, res) {
          if (err) response.status(500).json({
            statusCode: 500,
            message: "Server under maintenance !! Please try again in some time."
          });
          if (!res) response.status(404).json({
            statusCode: 401,
            message: "oops !! Wrong Password !!"
          });else {
            console.log({
              statusCode: 200,
              message: "".concat(user, " logged in successfully !!"),
              information: check
            });
            var token = jwt.sign({
              id: check.id,
              username: check.username
            }, "supersecretkey", {
              expiresIn: '100m'
            });
            response.cookie('token', token, {
              maxAge: 6000000
            });
            console.log(token);
            response.redirect('/');
          }
        });
      }
    }
  });
});
app.post('/insert_user', function (req, res) {
  var username = req.body.user;
  var password = req.body.pass;
  var phoneNumber = req.body.pn;
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var additionals_data = JSON.parse(data);
      var additional = {
        "username": username,
        "profile_image_src": "auto-generated.jpg",
        "instagram": "NA",
        "linkedin": "NA",
        "posts": [],
        "liked_posts": [],
        "report": []
      };
      additionals_data.push(additional);
      fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(additionals_data, null, 2), 'utf8', function (err) {
        if (err) throw err;
      });
    }
  });
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) throw err;else {
      fs.readFile('./assets/users_data/auth.json', 'utf8', function (err, data) {
        if (err) throw err;else {
          var temp = JSON.parse(data);
          var id = temp[temp.length - 1].id + 1;
          var newUser = {
            "id": id,
            "phoneNumber": phoneNumber,
            "username": username,
            "password": hash
          };
          temp.push(newUser);
          json = JSON.stringify(temp, null, 2);
          fs.writeFile('./assets/users_data/auth.json', json, 'utf8', function (err) {
            if (err) throw err;else {
              console.log({
                statusCode: 200,
                message: "".concat(username, " registered successfully !!"),
                information: newUser
              });
              res.redirect('/login');
            }
          });
        }
      });
    }
  });
});
app.post('/insert_post_data', upload_post_images.array('file'), function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  console.log(req.body);
  console.log(req.files);

  var type = _typeof(req.body.heading);

  console.log(type);
  var img_arr = [];
  req.files.forEach(function (element) {
    img_arr.push(element.filename);
  });
  var add_arr = [];

  if (type == 'object') {
    for (var i = 0; i < req.body.heading.length; i++) {
      add_arr.push({
        "heading": req.body.heading[i],
        "text": req.body.text[i]
      });
    }
  }

  if (type == 'string') {
    add_arr.push({
      "heading": req.body.heading,
      "text": req.body.text
    });
  }

  var fetched_post_data = {
    "post_id": user.id + '-' + Date.now(),
    "author": user.username || "Anonymous",
    "location_name": req.body.place_name || "Auto-Generated",
    "latitude": req.body.latitude,
    "longitude": req.body.longitude,
    "HIRT": req.body.HIRT || "NIL",
    "image_source": img_arr,
    "additional_query": add_arr || [],
    "views": 0,
    "likes": 0,
    "comments_count": 0,
    "comments": [],
    "reports": 0
  };
  fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var additionals_data = JSON.parse(data);
      var index = additionals_data.findIndex(function (element) {
        return element.username == user.username;
      });
      additionals_data[index].posts.push(fetched_post_data.post_id);
      fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(additionals_data, null, 2), 'utf8', function (err) {
        if (err) throw err;
      });
    }
  });
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var post_data = JSON.parse(data);
      post_data.push(fetched_post_data);
      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(post_data, null, 4), 'utf8', function (err) {
        if (err) throw err;else console.log("post data inserted");
      });
      res.redirect('/');
    }
  });
}); // incomplete

app.post('/update_profile', upload_profile_image.single('file'), function (req, res) {
  if (req.cookies.token) {
    var user = jwt.verify(req.cookies.token, "supersecretkey");
    console.log(user);
    console.log(req.body);
    console.log(req.file);
    fs.readFile('./assets/users_data/additionals.json', 'utf8', function (err, data) {
      if (err) throw err;else {
        var additionals_data = JSON.parse(data);
        var index = additionals_data.findIndex(function (element) {
          return element.username == user.username;
        });
        var pre_source = additionals_data[index].profile_image_src;
        additionals_data[index].profile_image_src = req.file ? req.file.filename : pre_source;
        additionals_data[index].bio = req.body.bio;
        additionals_data[index].instagram = req.body.instagram;
        additionals_data[index].linkedin = req.body.linkedin;
        fs.writeFile('./assets/users_data/additionals.json', JSON.stringify(additionals_data, null, 2), 'utf8', function (err) {
          if (err) throw err;else res.redirect("/".concat(user.username, "/profile"));
        });
      }
    });
  } else {
    res.status(401).send({
      statusCode: 401,
      message: "oops !! User not authorized !!"
    });
  }
});
app.post('/post/:post_id/add-comment', function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  console.log(req.body);
  console.log(user);
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var post_data = JSON.parse(data);
      var index = post_data.findIndex(function (element) {
        return element.post_id == req.params.post_id;
      });
      var count = post_data[index].comments_count;
      post_data[index].comments_count = count + 1;
      var comment_data = {
        "comm_id": Date.now(),
        "comm_author": user.username,
        "comm_text": req.body.comment_text,
        "likes": 0,
        "reply": []
      };
      post_data[index].comments.push(comment_data); //            console.log(post_data);

      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(post_data, null, 4), 'utf8', function (err) {
        if (err) throw err;else console.log("comment Added");
      });
      res.redirect('/');
    }
  });
});
app.post('/post/:post_id/add-reply', function (req, res) {
  var user = jwt.verify(req.cookies.token, "supersecretkey");
  console.log(req.body);
  console.log(user);
  fs.readFile('./assets/users_data/posts.json', 'utf8', function (err, data) {
    if (err) throw err;else {
      var post_data = JSON.parse(data);
      var post_index = post_data.findIndex(function (element) {
        return element.post_id == req.params.post_id;
      });
      var count = post_data[post_index].comments_count;
      post_data[post_index].comments_count = count + 1;
      var comment_index = post_data[post_index].comments.findIndex(function (element) {
        return element.comm_id == req.body.comm_id;
      });
      var reply_data = {
        "reply_id": Date.now(),
        "replying_to": req.body.replying_to,
        "replier_username": user.username,
        "replier_text": req.body.reply_text
      };
      post_data[post_index].comments[comment_index].reply.push(reply_data);
      fs.writeFile('./assets/users_data/posts.json', JSON.stringify(post_data, null, 4), 'utf8', function (err) {
        if (err) throw err;else console.log("comment Added");
      });
      res.redirect('/');
    }
  });
});
app.listen(3000, function () {
  console.log("Running on 3000");
});