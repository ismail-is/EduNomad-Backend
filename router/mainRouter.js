const  express =require('express');
const {JobInsert,JobViwe, JobViewSingle, DeleteJob, UpdateJob, JobViweAuth, JobViweSingleAuth} = require('../controller/jobPosting');


const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const { registerSchool, loginSchool, getSchoolProfile } = require('../controller/schoolController');
const { getProfile, register, login } = require('../controller/authController');
const { handleApplication, applicationView, applicationSingleView, adminStatus } = require('../controller/applicationController');
const { createAdminStatus, updateAdminStatus, viewAdminStatus } = require('../controller/adminController');


const router=express.Router();


router.post('/jobinsert', authMiddleware, roleMiddleware(['school','parent']), JobInsert);
router.get('/jobview',JobViwe);
router.get('/jobviewauth', authMiddleware, JobViweAuth);
router.get('/jobviewauth/:id', authMiddleware, JobViweSingleAuth);
router.get('/jobview/:id',  JobViewSingle);
router.delete('/jobdelete/:id', authMiddleware, roleMiddleware(['school','parent']), DeleteJob);
router.put('/jobupdate/:id', authMiddleware, roleMiddleware(['school','parent']), UpdateJob);

// apply

router.post('/apply', handleApplication)
router.get('/applyview', applicationView)
router.get('/applyview/:id', applicationSingleView)
router.put('/applyupate/:id', adminStatus)
// apply


// admin controller

router.post('/adminstatus', createAdminStatus);
router.put('/adminstatus/:id', updateAdminStatus);
router.get('/adminstatusView', viewAdminStatus);
// admin controller





// school
// Register
// router.post("/register", registerSchool);

// Login
// router.post("/login", loginSchool);

// Get Profile (Protected: School only)
// router.get("/profile", authMiddleware,roleMiddleware(["school"]),getSchoolProfile);

// school





module.exports=router;