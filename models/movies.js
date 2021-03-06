var mongoose = require("mongoose");

    const movieSchema = new mongoose.Schema({
        title: String,
        image: String,
        rating: Number,
        created: {type: Date, default: Date.now()},
        review: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
        comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
            ]
    });
    
    module.exports = mongoose.model('Movie', movieSchema);