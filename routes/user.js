const express = require('express');
//here we are creating separate router and registering routes on it
//learn more about this
const router = express.Router();

const {
    handleGetAllUsers,
    handleCreateUser,
    handleDeleteReq,
    handleUpdateReq,
    handleGetParticularUser
} = require('../controllers/user');

router.route("/:id")
.get(handleGetParticularUser)
.patch(handleUpdateReq)
.delete(handleDeleteReq)

router.route("/")
.post(handleCreateUser)
.get(handleGetAllUsers);

module.exports = router;