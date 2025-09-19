const express= require('express');
const cors = require("cors");
const app = express();
const path = require('path');
require('dotenv').config();
app.use(express.json())
app.use(cors());

// imports files
const data=require('./db');
// imports files
      
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api',require('./router/mainRouter'))
app.use("/api/auth", require("./router/authRoutes"));
app.use("/api", require("./router/protectedRoutes"));



data()
const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`server  ${port}`);
})