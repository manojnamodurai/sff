/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function validateSession(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var sessionVal = req.get("SessionVal");
  if (sessionVal) {
  	Session.findOne({value:sessionVal}).exec(function(err, fetchedSession){
  		sails.log.info(fetchedSession);
  		if(err){
  			return res.forbidden(err);
  		} else if(fetchedSession && fetchedSession.isValid){
  			next();
  		} else {
  			return res.forbidden('Provide Valid Session Value');
  		}
  	});
  } else {
  	return res.forbidden('Provide Session Value');
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
