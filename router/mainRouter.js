const  express =require('express');
const {JobInsert,JobViwe, JobViewSingle, DeleteJob, UpdateJob} = require('../controller/jobPosting');
const {TearcherInsert,TeacherView}=require('../controller/TeacherApply');
const upload = require('../middleware/multerConfig');

const router=express.Router();


router.post('/jobinsert',JobInsert);
router.get('/jobview',JobViwe);
router.get('/jobview/:id',JobViewSingle)
router.delete('/jobdelete/:id',DeleteJob)
router.put('/jobupdate/:id',UpdateJob)




// Teacher 
router.post('/teacherInsert',upload.single('uploadFile'),TearcherInsert)
router.get('/teacherview',TeacherView);
module.exports=router;