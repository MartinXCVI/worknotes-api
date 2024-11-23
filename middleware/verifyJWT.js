// JSON web token
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next)=> {
  /* Making sure there is an authorization in the headers
  of the request, either lowercase or capitalized 
  Since there is not an standard, it is proper 
  to look for both as a general good practice */
  const authHeader = req.headers.authorization || req.headers.Authorization

  // Checking if the headers start with the proper string
  if(!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  /* Grabbing the token by spliting the headers string 
  and taking the second value at position 1 in the array */
  const token = authHeader.split(' ')[1]

  /* Passing the token to the 'verify' method, and 
  verifying it with our access token secret */
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error, decoded)=> {
      if(error) return res.status(403).json({ message: 'Forbidden' })

      req.user = decoded.UserInfo.username
      req.roles = decoded.UserInfo.roles
      next()
    }
  )
}

module.exports = verifyJWT