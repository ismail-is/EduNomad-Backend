const  express =require('express');
const {JobInsert,JobViwe, JobViewSingle, DeleteJob, UpdateJob} = require('../controller/jobPosting');
const {TearcherInsert,TeacherView}=require('../controller/TeacherApply');
const upload = require('../middleware/multerConfig');


const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { registerSchool, loginSchool, getSchoolProfile } = require('../controller/schoolController');
const { getProfile, register, login } = require('../controller/authController');


const router=express.Router();


router.post('/jobinsert',JobInsert);
router.get('/jobview',JobViwe);
router.get('/jobview/:id',JobViewSingle)
router.delete('/jobdelete/:id',DeleteJob)
router.put('/jobupdate/:id',UpdateJob)




// Teacher 
router.post('/teacherInsert',upload.single('uploadFile'),TearcherInsert)
router.get('/teacherview',TeacherView);




// school
// Register
// router.post("/register", registerSchool);

// Login
// router.post("/login", loginSchool);

// Get Profile (Protected: School only)
// router.get("/profile", authMiddleware,roleMiddleware(["school"]),getSchoolProfile);

// school





module.exports=router;