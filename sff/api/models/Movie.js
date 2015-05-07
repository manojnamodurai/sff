/**
* Movie.js
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
  	title: {
  		type: 'string',
  		required: false
  	},
    description: {
      type: 'string',
      required: false
    },
  	releaseDate: {
  		type: 'date',
  		required: false
  	},
  	genre: {
  		type: 'string',
  		required: false,
      enum: ["comedy","love","drama","scifi","animation","horror","adventure","war","sport","action","thriller","documentary"]
  	},
  	crewTag: {
  		type: 'string',
  		required: false
  	},
  	thumbnailLink: {
  		type: 'string',
  		required: false
  	},
  	movieLink: {
  		type: 'string',
  		required: false
  	},
  	trailerLink: {
  		type: 'string',
  		required: false
  	},
    criticRating: {
      type: 'float',
      required: false,
      defaultsTo: 0
    },
    userRating: {
      type: 'float',
      required: false,
      defaultsTo: 0
    },
    viewCount: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    },
    criticRatingCount: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    },
    userRatingCount: {
      type: 'integer',
      required: false,
      defaultsTo: 0
    }
  }
};

