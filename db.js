const mongoose =require('mongoose');
require('dotenv').config();
const mongoDBURL=process.env.database;

const ConnectDataBase=async()=>{
    try{
        await  mongoose.connect(mongoDBURL);
        console.log("Data Base Connect ");
        
    }
    catch(error){
        console.log("Data Base NOt Connect!!!",error);
        

    }
}

module.exports=ConnectDataBase;