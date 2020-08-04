const jwt = require('jsonwebtoken');
const redis = require("redis");

//setup redis
const client = redis.createClient(process.env.REDIS_URI);

//checkPassword is a helper function that reture a promise
const checkPassword = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

//write function that does not exist, just to build step by step
const getAuthTokenId = () => {
  console.log('auth ok');
}

//keep function small and clean
//good for unit test
signToken = (email) => {
  const payload = { email };
  const token = jwt.sign(payload, "JWT_SECRET", { expiresIn: "1 day" });
  return token;
}

createSessions = (user) => {
  const { id, email } = user;
  const token = signToken(email);
  return { success: "true", userId: id, token: token }
}

// dependency injection
handleSigninAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() :
    checkPassword(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  handleSigninAuthentication: handleSigninAuthentication
}
