const User = require('../models/user');

async function handleGetAllUsers(req, res) {
    const users = await User.find({});
    return res.status(200).json(users);
}

async function handleCreateUser(req, res) {
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
    return res.status(201).json({msg : "success", id: result._id});
}

async function handleDeleteReq(req, res){
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(200).json({status: "userDeleted"});
}

async function handleUpdateReq(req, res){
    const body = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
        firstName: body.first_name,
        lastName : body.last_name,
        email : body.email,
        gender : body.gender,
        jobTitle: body.job_title,
    });
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(201).json({status: "patchSuccess"});
}

async function handleGetParticularUser(req, res){
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({msg : "user not found"});
    return res.status(200).json(user);
}

module.exports = {
    handleGetAllUsers,
    handleCreateUser,
    handleDeleteReq,
    handleUpdateReq,
    handleGetParticularUser
}