const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    email: { type: String, required: [true, 'E-mail secsion is empty!'] },
    password: { type: String, required: [true, 'Enter a valid password!'] },
    role: { type: String, required: true }

});

const PostSchema = new mongoose.Schema({

    date: { type: String, required: true },
    title: { type: String, required: true['This post needs a title'] },
    post: { type: String, required: true['No text, No post! LOL...'] }

});



const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);


module.exports = {

    User,
    Post,
    
};