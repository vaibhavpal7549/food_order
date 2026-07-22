app.post("/register", async (req, res) => {
    try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.json({ msg: "User registered" });
    } catch (err) {
    res.status(500).json({ msg: "Server error" });
    }
});