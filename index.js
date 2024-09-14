const express = require("express");
const app  =  express();
const port  =  2000;
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.get("/home",(req,res)=>{
     res.statusCode=200;
    // console.log(res);
    var data = [
        
        { 'id': '45', 'name': 'Rahul Gupta', 'enrollment': 'AJU/220941', 'course': 'BBA', 'intermediate': 'Commerce' },
        { 'id': '46', 'name': 'Sonia Mehta', 'enrollment': 'AJU/220951', 'course': 'B.Ed', 'intermediate': 'ARTs' },
        { 'id': '47', 'name': 'Karan Singh', 'enrollment': 'AJU/220961', 'course': 'B.Tech', 'intermediate': 'Science' },
        { 'id': '48', 'name': 'Sakshi Verma', 'enrollment': 'AJU/220971', 'course': 'BCA', 'intermediate': 'Computer Science' },
        { 'id': '49', 'name': 'Mohit Raj', 'enrollment': 'AJU/220981', 'course': 'B.Com', 'intermediate': 'Commerce' },
        { 'id': '50', 'name': 'Reena Chauhan', 'enrollment': 'AJU/220991', 'course': 'BA', 'intermediate': 'ARTs' },
        // Add more entries here until the list reaches 100
      ];
   
    
    res.send(data);
});

app.listen(port,()=>{
    console.log("app is listing in ", port);
});

// npm init -y
// npm i express
