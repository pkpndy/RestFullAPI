const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

//connection
mongoose.connect('mongodb://127.0.0.1:27017/trialdb')
.then(() => console.log("mongoDB connected"))
.catch((err) => console.log(err));

//schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
    },
    jobTitle:{
        type: String
    },
},
{timestamps: true}
);

//Model creation
const User = mongoose.model("user", userSchema);

app.use(express.urlencoded({extended: false}));

app.route("/api/users/:id")
.get(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(200).json(user);
})
.patch(async(req, res) => {
    const body = req.body;
    console.log(body);
    console.log(req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, {
        firstName: body.first_name,
        lastName : body.last_name,
        email : body.email,
        gender : body.gender,
        jobTitle: body.job_title,
    });
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(201).json({status: "patchSuccess"});

})
.delete(async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(200).json({status: "userDeleted"});
})

app.route("/api/users")
.post(async(req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(404).json({msg: "All fields are required..."});
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName : body.last_name,
        email : body.email,
        gender : body.gender,
        jobTitle: body.job_title,
    });
    return res.status(201).json({msg : "success"});
}).get(async(req, res) => {
    const users = await User.find({});
    return res.status(200).json(users);
})

app.get("/users", async(req, res) => {
    const users = await User.find({});
    const html =
    `
    <ul>
        ${users.map((user) => `<li>${user.firstName}</li>`).join("")}
    </ul>
    `
    res.status(200).send(html);
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})