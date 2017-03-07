var jwt = require('jwt-simple');
var url = require('url');
var Session = require('config/session');

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
 
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
 
  if (token || key) {
    try {
      var decoded = jwt.decode(token, require('config/secret.js')());
      console.log(decoded);
 
      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "success":false,
          "status": 400,
          "message": "Token Expired"
        });
        next();
        return;
      }

      var url_parts = url.parse(req.url);
      var pathname = url_parts.pathname;
      var pathname_parts = pathname.split('/');
      var module_name = pathname_parts[3];
      var function_name = pathname_parts[4]||'';

      var auth_file_path = 'controllers/'+module_name+'/'+'authorization';
      var auth = require(auth_file_path);

      var auth_list = auth.get('/'+function_name);
      if(auth_list.length == 0)
      {
        next();
      }
      else{
          var session = new Session(req.query.access_token,function(err,result){
            if(err)
            {
              res.status(401);
              res.json({
                "success":false,
                "err_msg":'some problem in session'
              });
              
              next();
            }
          });
          var auth_id = session.getAuthId();
          if(auth_list.includes(auth_id))
          {
            next();
          }
          else{
            res.status(401);
            res.json({
                "success":false,
                "err_msg":'You are not authorized to access this resource'
            });
            next();
          }
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": "Unauthorized access"
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }
};