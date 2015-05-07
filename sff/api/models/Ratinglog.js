/**
* Watchlog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	userId: {
  		type: 'string',
  		required: true
  	},
  	movieId: {
  		type: 'string',
  		required: true
  	},
  	rating: {
  		type: 'float',
  		required: false
  	}
  }
};

