module.exports = {

	createSession: function(session, cb){
		Session.create({value: session.value, userId: session.userId, isValid: true}).exec(function createCB(err, createdSession){
			if(createdSession){
				sails.log.info("test2");
				cb(createdSession);
			} else {
				sails.log.info("test3");
				cb(null);
			}
		});
	},

	isValidUser: function(userId, cb){
		User.findOne(userId).exec(function fetchedCB(err, fetchedUser){
			sails.log.info(fetchedUser);
			if(fetchedUser)
				cb(true);
			else
				cb(false);
		});
	},

	isCritic: function(userId, cb){
		User.findOne(userId).exec(function fetchedCB(err, fetchedUser){
			sails.log.info(fetchedUser);
			if(fetchedUser && fetchedUser.isCritic)
				cb(true);
			else
				cb(false);
		});
	}
};