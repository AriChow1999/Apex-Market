const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the authorization header from the incoming request
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token part after 'Bearer '
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user payload (e.g., user ID) to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports= verifyToken; // Use module.exports if you are using CommonJS (require)