/**
 * PromotionController
 *
 * @description :: Server-side logic for managing promotions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	promotionList: function(req,res){
		var targetDate = new Date(new Date() - (7 * 24 * 60 * 60 * 1000));
		sails.log.info(targetDate);
		Movie.find(
			{
				fields: ['title', 'description', 'releaseDate', 'genre', 'thumbnailLink', 'trailerLink', 'criticRating', 'userRating'],
				where: { releaseDate: {'>=':targetDate}	},
				sort: 'releaseDate ASC'
			}).exec(function (err, fetchedMovies){
				if(err)
					return res.send(err);
				else if(fetchedMovies && fetchedMovies.length > 0){
					response = new Object();
					response.message = "Movies fetched successfully for promotion";
					response.status = "SUCCESS";
					response.movies = fetchedMovies;
					return res.send(response);
				} else {
					response = new Object();
					response.message = "No movies for promotion";
					response.status = "SUCCESS";
					return res.send(response);
				}
		});
	}

};

