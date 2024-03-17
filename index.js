const express = require('express');
const fs = require('fs');
const users =   require('./MOCK_DATA.json');

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}));

app.route("/api/users/:id")
.get((req, res) => {
    const userID = Number(req.params.id);
    if(userID > users.length){
        return res.json({err: "id greater than users list"});
    }
    const user = users.find((user) => user.id === userID);
    return res.json(user);
})
.patch((req, res) => {
    const userID = Number(req.params.id);
    if(userID > users.length){
        return res.json({err: "id greater than users list"});
    }
    const userIndex = users.findIndex(user => user.id === userID);
    const newData = req.body;
    Object.assign(users[userIndex], newData);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "patchSuccess", id: userIndex+1 });
    });
})
.delete((req, res) => {
    const userID = Number(req.params.id);
    if(userID > users.length){
        return res.json({err: "id greater than users list"});
    }
    const lastUserBefore = users.length;
    const userIndex = users.findIndex(user => user.id === userID);
    users.splice(userIndex, 1)[0];
    const lastUserAfter = users.length;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "userDeleted", usersBefore: lastUserBefore, usersAfter: lastUserAfter});
    })
})

app.route("/api/users")
.post((req, res) => {
    const body = req.body;
    console.log(body);
    const lastUserID = Number(users.length + 1);
    users.push({
        "id" : lastUserID,
        "first_name": body.first_name,
        "last_name" : body.last_name,
        "email" : body.email,
        "gender" : body.gender,
        "job_title" : body.job_title
    });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({status: "postSuccess", id: lastUserID});
    });
}).get((req, res) => {
    return res.json(users);
})

app.get("/users", (req, res) => {
    const html =
    `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})