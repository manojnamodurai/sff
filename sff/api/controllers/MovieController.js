/**
 * MovieController
 *
 * @description :: Server-side logic for managing Movies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var response;

var movieUploadLocation = "/var/www/html/sff/movie";
var trailerUploadLocation = "/var/www/html/sff/trailer";
var thumbnailUploadLocation = "/var/www/html/sff/thumbnail";
var movieStreamer = "http://localhost/sff/movie";
var trailerStreamer = "http://localhost/sff/trailer";
var thumbnailStreamer = "http://localhost/sff/thumbnail";

var userService = require('../services/UserServiceHelper.js');

module.exports = {
	
	movieUpload: function(req,res){
		var userId = req.param("userId");
		var uploadedMovie;
		userService.isValidUser(userId,function(isValid){
			sails.log.info(isValid);
			if(isValid){
				req.file("movie").upload({
					dirname: require('path').resolve(sails.config.appPath, movieUploadLocation)
				}, function (err, uploadedFiles){
					sails.log.info(uploadedFiles);
					if(err)
						return res.negotiate(err);
					else {
						uploadedMovie = uploadedFiles[0];
						var link = uploadedMovie.fd.replace(movieUploadLocation, movieStreamer);
						Movie.create({userId: userId, movieLink:link}).exec(function createdCB(err, createdMovie){
							if(err){
								return res.send(err);
							}
							else if(createdMovie){
								response = new Object();
								response.message = "Movie uploaded successfully";
								response.status = "SUCCESS";
								response.movie = createdMovie;
								return res.send(response);
							} else {
								response = new Object();
								response.message = "Movie failed to upload";
								response.status = "FAILURE";
								return res.send(response);
							}
						});
					}
				});
			} else {
				response = new Object();
				response.message = "Provide valid user id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	},

	trailerUpload: function(req,res){
		var movieId = req.param("movieId");
		var uploadedTrailer;
		Movie.findOne({id:movieId}).exec(function (err, fetchedMovie){
			if(err)
				return res.send(err);
			else if(fetchedMovie){
				req.file("trailer").upload({
					dirname: require('path').resolve(sails.config.appPath, trailerUploadLocation)
				}, function (err, uploadedFiles){
					if(err)
						return res.send(err);
					else {
						uploadedTrailer = uploadedFiles[0];
						var link = uploadedTrailer.fd.replace(trailerUploadLocation, trailerStreamer);
						fetchedMovie.trailerLink = link;
						fetchedMovie.save(function(err){
							if(err)
								return res.send(err);
							else {
								response = new Object();
								response.message = "Trailer uploaded successfully";
								response.status = "SUCCESS";
								response.movie = fetchedMovie;
								return res.send(response);
							}
						});
					}
				});
			} else {
				response = new Object();
				response.message = "Provide valid movie id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	},

	details: function(req,res){
		var movieDetails = req.body;
		var movieId = req.param("movieId");
		Movie.findOne({id:movieId}).exec(function (err, fetchedMovie){
			if(err)
				return res.send(err);
			else if(fetchedMovie){
				if(movieDetails.title){
					fetchedMovie.title = movieDetails.title;
				}
				if(movieDetails.description){
					fetchedMovie.description = movieDetails.description;
				}
				if(movieDetails.genre){
					fetchedMovie.genre = movieDetails.genre;
				}
				sails.log.info(movieDetails);
				sails.log.info(movieDetails.releaseDate);
				if(movieDetails.releaseDate){
					fetchedMovie.releaseDate = new Date(movieDetails.releaseDate);
				}
				//fetchedMovie.crewTag = movieDetails.crewTag;
				fetchedMovie.save(function(err){
					if(err)
						return res.send(err);
					else {
						response = new Object();
						response.message = "Movie details updated successfully";
						response.status = "SUCCESS";
						response.movie = fetchedMovie;
						return res.send(response);
					}
				});
			} else {
				response = new Object();
				response.message = "Provide valid movie id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	},

	fetch: function(req,res){
		var movieId = req.param("movieId");
		Movie.findOne({id: movieId}).exec(function(err, fetchedMovie){
			if(err)
				return res.send(err);
			else if(fetchedMovie){
				response = new Object();
				response.message = "Movie details fetched successfully";
				response.status = "SUCCESS";
				response.movie = fetchedMovie;
				return res.send(response);
			} else {
				response = new Object();
				response.message = "Provide valid movie id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	},

	criticRelease: function(req,res){
		var userId = req.param("userId");
		userService.isCritic(userId,function(isValid){
			if(isValid) {
				Movie.find({
					where: {
						releaseDate: {'>':new Date()}
					},
					sort: 'releaseDate ASC'
				}).exec(function (err, fetchedMovies){
					if(err)
						return res.send(err);
					else if(fetchedMovies && fetchedMovies.length > 0){
						response = new Object();
						response.message = "Movies fetched successfully";
						response.status = "SUCCESS";
						response.movies = fetchedMovies;
						return res.send(response);
					} else {
						response = new Object();
						response.message = "No movies for critic release";
						response.status = "SUCCESS";
						return res.send(response);
					}
				});
			} else {
				response = new Object();
				response.message = "Provide valid critic user id";
				response.status = "FAILURE";
				return res.send(response);
			}
		});
	},

	publicRelease: function(req,res){
		Movie.find({
			where: {
				releaseDate: {'<=':new Date()}
			},
			sort: 'releaseDate DESC'
		}).exec(function (err, fetchedMovies){
			if(err)
				return res.send(err);
			else if(fetchedMovies && fetchedMovies.length > 0){
				response = new Object();
				response.message = "Movies fetched successfully";
				response.status = "SUCCESS";
				response.movies = fetchedMovies;
				return res.send(response);
			} else {
				response = new Object();
				response.message = "No movies for public release";
				response.status = "SUCCESS";
				return res.send(response);
			}
		});
	}
};

