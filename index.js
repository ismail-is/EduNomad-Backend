const express= require('express');
const app = express();
require('dotenv').config();
app.use(express.json())



// imports files
const data=require('./db');
// imports files
      
app.use('/uploads', express.static('uploads')); 
app.use('/api',require('./router/mainRouter'))




data()
const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`server  ${port}`);
})