const  express =require('express');
const {JobInsert,JobViwe, JobViewSingle, DeleteJob, UpdateJob, JobViweAuth} = require('../controller/jobPosting');


const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const { registerSchool, loginSchool, getSchoolProfile } = require('../controller/schoolController');
const { getProfile, register, login } = require('../controller/authController');
const { handleApplication } = require('../controller/applicationController');


const router=express.Router();


router.post('/jobinsert', authMiddleware, roleMiddleware(['school','parent']), JobInsert);
router.get('/jobview',JobViwe);
router.get('/jobviewauth', authMiddleware, JobViweAuth);
router.get('/jobview/:id',  JobViewSingle);
router.delete('/jobdelete/:id', authMiddleware, roleMiddleware(['school','parent']), DeleteJob);
router.put('/jobupdate/:id', authMiddleware, roleMiddleware(['school','parent']), UpdateJob);

// apply

router.post('/apply', handleApplication)
// apply


// Teacher 





// school
// Register
// router.post("/register", registerSchool);

// Login
// router.post("/login", loginSchool);

// Get Profile (Protected: School only)
// router.get("/profile", authMiddleware,roleMiddleware(["school"]),getSchoolProfile);

// school





module.exports=router;