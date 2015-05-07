/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require("bcrypt");

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },

  	email: {
  		type: 'email',
  		required: true,
      unique: true
  	},
  	password: {
  		type: 'STRING',
  		required: true
  	},
    isCritic: {
      type: 'BOOLEAN',
      required: false
    }
  	
  },

  beforeCreate: function(user,cb){
    /*bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) {
          sails.log.error(err);
          cb(err);
        }
        else {
          user.password = hash;
          cb(null, user);
        }
      });
    });*/
    user.isCritic = false; 
    cb(null, user);
  }

};

