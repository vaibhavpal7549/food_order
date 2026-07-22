const { MONGO_CLIENT_EVENTS } = require("mongodb");

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

    const userSchema = new mongoose.Schema({
        name: String,
            email: { type: String, unique: true },
            password: String});

            
    });

    const User = mongoose.model("User", userSchema);

