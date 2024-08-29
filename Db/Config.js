const mongoose = require('mongoose');

 mongoose.connect('mongodb://127.0.0.1:27017/ZohoProject')
  .then(() => console.log('MongoDB Connected!'));
  
  const db =mongoose.connection

  db.on('open',()=>{console.log("success mongodb");})


