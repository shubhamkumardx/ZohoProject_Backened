const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json({ extended: true });
const  Controller = require('../Controllers/index')
const cors = require ('cors');
router.use(cors({origin:'http://localhost:3000'}))

// REDIRECT URL 
router.get("/callback", (req, res) => {
    res.send("hello");
  });

 // LOGIN ROUTE 
router.post('/login',cors(),urlencodedParser, Controller.LoginUser)

// CREATE TOKEN ROUTE 
router.post('/getZohoAccessToken',cors(),urlencodedParser, Controller.getZohoAccessToken)

// GET SINGLE PROJECT ROUTE
router.get('/getSingleProject',cors(),urlencodedParser, Controller.getSingleProjectData)

// GET ALL PROJECTS
router.post('/getallprojects',cors(),urlencodedParser, Controller.getAllProjects)

// GET ALL TASKS ON THE BASIS OF PROJECT ID
router.post('/getallTasks/:Project_id',cors(),urlencodedParser, Controller.getAllTasks)

// CREATE A CLIENT IN MONGODB
router.post('/Createclient',cors(),urlencodedParser, Controller.CreateClient)

// GET CLIENT FROM MONGODB
router.get('/getClient',cors(),urlencodedParser, Controller.getClients)

// CLIENT LOGIN
router.post('/Clientlogin',cors(),urlencodedParser, Controller.LoginClient)

// CLIENT TASK LIST 
router.post('/getallClientTask/:ProjectId',cors(),urlencodedParser, Controller.getallClientTask)

module.exports = router;