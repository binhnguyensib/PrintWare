import { adminAuth } from '../services/FirebaseAdminSDK.js';

export default async function Authenticate(req, res, next) {
  const token = req.headers.authorization;  

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token.split('Bearer ')[1]);
    // const decodedToken = await webAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};