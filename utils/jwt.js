
const jwt = require('jsonwebtoken');

module.exports = {
	authenticateToken: (req, res, next) => {
		if (typeof(req.headers.authorization) === 'undefined') return res.status(401);
		let token = req.headers.authorization.split(' ')[1];

		jwt.verify(token, process.env.SECRET, (err) => {
			if (err) return res.sendStatus(403);
			next(); 
		});
	},
	makeAccessToken: (id) => {
		return jwt.sign({id: id}, process.env.SECRET, { expiresIn: '365d' });
  }
}