import { getIO } from '../controllers/socket.js';

export const attachIO = (req, res, next) => {
  try {
    req.io = getIO();
    next();
  } catch (err) {
    next(err);
  }
};
