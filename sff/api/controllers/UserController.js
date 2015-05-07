/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var uuid = require('uuid');

var userService = require('../services/UserServiceHelper.js');

var response;

module.exports = {

	registration: function(req,res){
		var user = req.body;
		User.findOne({email: user.email}).exec(function(err, fecthedUser){
			if(err)
				return res.send(err);
			else if(fecthedUser){
				response = new Object();
				response.message = "User already exists";
				response.status = "FAILURE";
				return res.send(response);
			} else {
				User.create({email: user.email, name: user.name, password: user.password}).exec(function(err, createdUser){
					if(err)
						return res.send(err);
					else if(createdUser){
						response = new Object();
						response.message = "User registered successfully";
						response.status = "SUCCESS";
						response.user = createdUser;
						return res.send(response);
					} else {
						response = new Object();
						response.message = "User registration failed";
						response.status = "FAILURE";
						return res.send(response);
					}
				});
			}
		});
	},

	login: function (req, res){
		var user = req.body;
		var usernameVal = user.username;
		var passwordVal = user.password;
		User.findOne({email: usernameVal, password:passwordVal}, function(err, fecthedUser){
			if(err){
				return res.send(err);
			} else if(fecthedUser){
				response = new Object();
				var session = {};
				session.value = uuid.v4();
				session.userId = fecthedUser.id;
				userService.createSession(session, function(createdSession){
					if(createdSession){
						response.message = "User logged in successfully";
						response.sessionVal = session.value;
						response.status = "SUCCESS";	
						response.isValid = true;
					} else {
						response.message = "Failed to create session";	
						response.status = "FAILURE";
						response.isValid = false;
					}
					return res.send(response);
				});
			} else {
				response = new Object();
				response.message = "Invalid user credentials";
				response.status = "SUCCESS";
				response.isValid = false;
				return res.send(response);
			}
		});
	},

	logout: function(req,res){
		var sessionVal = req.param("sessionVal");
		sails.log.info(sessionVal);
		if(sessionVal){
			Session.findOne({value: sessionVal}).exec(function deleteCB(err, deletedSession){
				sails.log.info(deletedSession);
				response = new Object();
					if(err){
						return res.send(err);
					} else if(deletedSession){
						deletedSession.isValid = false;
						deletedSession.save(function(err){
							if(err){
								return res.send(err);
							} else {
								response.message = "User logged out successfully";
								response.sessionVal = deletedSession.value;	
								response.isLoggedOut = true;
								response.status = "SUCCESS";
								return res.send(response);
							}
						});
					} else {
						response.message = "Invalid session value";	
						response.isLoggedOut = false;
						response.status = "FAILURE";
						return res.send(response);
					}
				});
		} else {
			response = new Object();
			response.message = "Provide valid session value";
			response.isValid = false;
			response.status = "FAILURE";
			return res.send(response);
		}
	},

	fetchUser: function(req,res){
		var sessionVal = req.param("sessionVal");
		if(sessionVal){
			Session.findOne({value: sessionVal}).exec(function (err, session){
				response = new Object();
					if(err){
						return res.send(err);
					} else if(session && session.isValid){
						User.findOne({id: session.userId}).exec(function (err, fetchedUser){
							if(err)
								return res.send(err);
							else if(fetchedUser){
								response.message = "User fetched successfully";
								response.user = fetchedUser;
								response.status = "SUCCESS";
								return res.send(response);
							} else {
								response.message = "Failed to fetch user";	
								response.isLoggedOut = false;
								response.status = "FAILURE";
								return res.send(response);
							}
						});
					} else {
						response.message = "Invalid session value";	
						response.isLoggedOut = false;
						response.status = "FAILURE";
						return res.send(response);
					}
				});
		} else {
			response = new Object();
			response.message = "Provide valid session value";
			response.isValid = false;
			response.status = "FAILURE";
			return res.send(response);
		}
	}
};

