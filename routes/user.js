
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.save = function (req, res) {
 res.send("got it");
};

//test config to run a method
exports.init = function (req, res) {
  res.send("reach the init func");
};
