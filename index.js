const express = require('express');
const {connectMongoDB} = require('./connection')
const {logReqRes} = require('./middlewares') //index file is taken automatically
const userRouter = require('./routes/user')

const app = express();
const PORT = 8000;

//connection
connectMongoDB('mongodb://127.0.0.1:27017/trialdb')
.then(() => console.log("mongoDB connected"))
.catch((err) => console.log(err));

//middleware for url encoded form
app.use(express.urlencoded({extended: false}));

//logging middleware
app.use(logReqRes("log.txt"));

//routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})