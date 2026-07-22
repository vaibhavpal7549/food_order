const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ msg: "No token" });

    try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded.id;
    next();
    } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
    }
};

