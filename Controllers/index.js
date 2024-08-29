const db = require("../Db/Config");
const User = require("../Model/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const secretkey = "SECRETKEY";
const Client = require("../Model/Createclient");

// LOGIN API
module.exports.LoginUser = async (req, res) => 
  {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const URL = `https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.34c6546292ac990efa2ee5b0dc285abf.6530a792a4e8868553dcab04d1e1cb7a&client_id=1000.OK1FQWPPEZON1WXCZL72Q6DD6MPTUZ&client_secret=27c53f9efa67772b4e203e2ddc14d1dcaf453a410b&grant_type=refresh_token`;

    try {
      const response = await axios.post(URL);
      return res.json({
        message: "Login Successfully..!",
        user,
        Res_Token: response.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving the Token",
        error: error.response ? error.response.data : error.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// CREATE TOKEN API
module.exports.getZohoAccessToken = async (req, res) => {
  const authorizationCode = req.body.code; // Authorization code from the client

  try {
    // POST request to Zoho's token endpoint
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          code: authorizationCode,
        },
      }
    );

    // Send the response from Zoho back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error(
      "Error generating access token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate access token" });
  }
};

// GET SINGLE PROJECT API
module.exports.getSingleProjectData = (req, res) => {
  const url = `https://projectsapi.zoho.com/restapi/portal/838756941/projects/2236347000000099335/`;
  axios
    .get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    })
    .then((response) => {
      // Send the project data as the response
      res.json(response.data);
    })
    .catch((error) => {
      // Handle the error and send it back as a response
      res.status(500).json({
        message: "Error retrieving project data",
        error: error.response ? error.response.data : error.message,
      });
    });
};

// GET ALL PROJECTS DATA
module.exports.getAllProjects = (req, res) => {
  const url = `https://projectsapi.zoho.com/restapi/portal/838756941/projects/`;
  const accessToken = req.body.accessToken;

  if (!accessToken) {
    return res.status(400).json({ message: "Access token is required" });
  }

  axios
    .get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        Accept: "application/json",
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving project data",
        error: error.response ? error.response.data : error.message,
      });
    });
};

// GET ALL TASK ON THE BASIS OF PROJECT ID
module.exports.getAllTasks = (req, res) => {
  const { Project_id } = req.params;
  const accessToken = req.body.accessToken;
  console.log(accessToken);

  if (!accessToken) {
    return res.status(400).json({ message: "Access token is required" });
  }

  const url = `https://projectsapi.zoho.com/restapi/portal/838756941/projects/${Project_id}/tasks/`;
  axios
    .get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        Accept: "application/json",
      },
    })
    .then((response) => {
      // Send the project data as the response
      console.log(response);
      res.json(response.data);
    })
    .catch((error) => {
      // Handle the error and send it back as a response
      res.status(500).json({
        message: "Error retrieving project data",
        error: error.response ? error.response.data : error.message,
      });
    });
};

// CREATE A CLIENT IN THE MONGODB
module.exports.CreateClient = async (req, res) => {
  const { name, email, projectId, password } = req.body;

  if (!name || !email || !projectId || !password) {
    return res.status(400).json({ msg: "Please fill in all fields" });
  }

  try {
    let user = await Client.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const newUser = new Client({
      name,
      email,
      projectId,
      password,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET CLIENT FROM MONGO DB 

module.exports.getClients = async (req,res) => {
  try {
    // Fetch all users from the database
    const users = await Client.find();
    // Send the users back in the response
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// CLIENT LOGIN
module.exports.LoginClient = async (req, res) => 
  {
    const { email, password } = req.body;
  
    try {
      const user = await Client.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email" });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      const URL = `https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.34c6546292ac990efa2ee5b0dc285abf.6530a792a4e8868553dcab04d1e1cb7a&client_id=1000.OK1FQWPPEZON1WXCZL72Q6DD6MPTUZ&client_secret=27c53f9efa67772b4e203e2ddc14d1dcaf453a410b&grant_type=refresh_token`;
  
      try {
        const response = await axios.post(URL);
        return res.json({
          message: "Login Successfully..!",
          user,
          Res_Token: response.data,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error retrieving the Token",
          error: error.response ? error.response.data : error.message,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  };

// GET ALL CLIENT TASK
module.exports.getallClientTask = async (req,res) => {
  const { ProjectId } = req.params;
  const accessToken = req.body.accessToken;
  console.log(accessToken);

  if (!accessToken) {
    return res.status(400).json({ message: "Access token is required" });
  }

  const url = `https://projectsapi.zoho.com/restapi/portal/838756941/projects/${ProjectId}/tasks/`;
  axios
    .get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        Accept: "application/json",
      },
    })
    .then((response) => {
      // Send the project data as the response
      console.log(response);
      res.json(response.data);
    })
    .catch((error) => {
      // Handle the error and send it back as a response
      res.status(500).json({
        message: "Error retrieving project data",
        error: error.response ? error.response.data : error.message,
      });
    });
}