app.get("/profile", authMiddleware, async (req, res) => {
    try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
    } catch (err) {
    res.status(500).json({ msg: "Server error" });
    }
});