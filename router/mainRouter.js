const  express =require('express');
const {JobInsert,JobViwe, JobViewSingle, DeleteJob, UpdateJob} = require('../controller/jobPosting');
const TearcherInsert=require('../controller/TeacherApply');

const router=express.Router();


router.post('/jobinsert',JobInsert);
router.get('/jobview',JobViwe);
router.get('/jobview/:id',JobViewSingle)
router.delete('/jobdelete/:id',DeleteJob)
router.put('/jobupdate/:id',UpdateJob)




// Teacher 
router.post('/teacherInsert',TearcherInsert)
module.exports=router;