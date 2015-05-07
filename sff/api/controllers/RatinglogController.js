/**
 * RatinglogController
 *
 * @description :: Server-side logic for managing ratinglogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var response;

module.exports = {

	rating: function(req,res){
		var ratingObj = req.body;
		User.findOne({id: ratingObj.userId}).exec(function(err,fetchedUser){
			if(err)
				return res.send(err);
			else if(fetchedUser){
				Movie.findOne({id: ratingObj.movieId}).exec(function(err, fetchedMovie){
					if(err)
						return res.send(err);
					else if(fetchedMovie){
						if(fetchedUser.id == fetchedMovie.userId){
							response = new Object();
							response.message = "User can't rate their own movie";
							response.status = "FAILURE";
							return res.send(response);	
						} else {
							if(fetchedUser.isCritic){
								var count = fetchedMovie.criticRatingCount;
								fetchedMovie.criticRatingCount = fetchedMovie.criticRatingCount + 1;
								fetchedMovie.criticRating = ((fetchedMovie.criticRating*count) + ratingObj.rating)/(fetchedMovie.criticRatingCount);
							} else{
								var count = fetchedMovie.userRatingCount;
								fetchedMovie.userRatingCount = fetchedMovie.userRatingCount + 1;
								fetchedMovie.userRating = ((fetchedMovie.userRating*count) + ratingObj.rating)/(fetchedMovie.userRatingCount);
							}
							Ratinglog.create({userId: ratingObj.userId, movieId: ratingObj.movieId, rating: ratingObj.rating}).exec(function(err, createdRating){
								if(err)
									return res.send(err);
								else if(createdRating){
									fetchedMovie.save(function(err){
										if(err)
											return res.send(err);
										else {
											response = new Object();
											response.message = "Rating updated successfully";
											response.status = "SUCCESS";
											response.movie = createdRating;
											return res.send(response);
										}
									});
								} else {
									response = new Object();
									response.message = "Failed to update rating";
									response.status = "FAILURE";
									return res.send(response);
								}
							});
						}
					} else {
						response = new Object();
						response.message = "Provide valid movie id";
						response.status = "FAILURE";
						return res.send(response);
					}
				});
			} else {
				response = new Object();
				response.message = "Provide valid user id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	}
};

