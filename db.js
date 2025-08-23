const mongoose =require('mongoose');
require('dotenv').config();
// const mongoDBURL='mongodb://127.0.0.1:27017/Edunomad';

const ConnectDataBase=async()=>{
    try{
        await  mongoose.connect(process.env.MONGODB_URI);
        console.log("Data Base Connect ");
        
    }
    catch(error){
        console.log("Data Base NOt Connect!!!",error);
        

    }
}

module.exports=ConnectDataBase;