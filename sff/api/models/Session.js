/**
* Session.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	value: {
  		type: 'string',
  		required: true,
      	unique: true
  	},
  	userId: {
  		type: 'string',
  		required: true
  	},
    isValid: {
      type: 'boolean',
      required: true
    }
  }
};

