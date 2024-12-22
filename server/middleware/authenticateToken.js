import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // קבלת הטוקן מתוך ה-Headers
  const token = req.headers.authorization?.split(" ")[1]; // צורת הטוקן: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // אימות עם המחרוזת הסודית
    req.user = decoded; // שמירת נתוני המשתמש ב-req
    next(); // ממשיכים לראוטר הבא
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};
