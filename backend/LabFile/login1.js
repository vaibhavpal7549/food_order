app.post("/login", async (req, res) => {
    try {
    const { email, password } = req.body;

    const user = await UserActivation.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "1d"
    });

    res.json({ token });
    } catch (err) {
    res.status(500).json({ msg: "Server error" });
}
    });


