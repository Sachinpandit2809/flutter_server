const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Create an Express app
const app = express();
const port = 2000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fashionDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const fashionSchema = new mongoose.Schema({
  title: { type: String, required: true,},
  description: { type: String, required: true, },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

// User model
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', userSchema);
const Children = mongoose.model('Children', userSchema);
const Product = mongoose.model('Product', fashionSchema);



app.get('/fashion_home',async(req,res)=>{
  try {
    var fashion = await Product.find();
    var data ={fashionData:fashion};
    res.status(200).json(data);
  
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
  });

app.post('/fashion_home',async(req,res)=> {
  try{
    console.log("post request accepted");
  const {title,description,price,image} = req.body;
  console.log(req.body);
  if (!title || !description || !price || !image) {
    return res.status(400).json({ message: 'All fields are required' });

  }
  const newProduct = new Product({ title,description,price,image, });
    await newProduct.save();
    const token = newProduct._id;
    res.status(201).json({ message: 'Product created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// // first chanced
// app.put('/fashion_home', async(req, res) => {
//   console.log("Requested geted");
//   try {
//     const { title, description, price, image, id } = req.body;
//     console.log("Printing req body =>", req.body);

//     // Validate required fields
//     if (!id) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

//     // Convert id to a valid ObjectId
//     const objectId = mongoose.Types.ObjectId(id.replace(/ObjectId\(|\)/g, ''));

//     console.log("Converted ObjectId:", objectId);

//     // Check if all fields are provided
//     if (!title || !description || !price || !image) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Find and update product
//     const updatedProduct = await Product.findByIdAndUpdate(
//       { _id: objectId },
//       {
//         $set: {
//           title,
//           description,
//           price,
//           image,
//         },
//       },
//       { new: true }
//     );

//     console.log("Printing updated Product ->", updatedProduct);

//     // Handle product not found
//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json({
//       message: 'Product updated successfully',
//       data: updatedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });




// app.put('/fashion_home', async(req, res) => {
//   console.log("Requested geted");
//   try {
//     // const id = req.params.id;
//     // console.log(`this is extracted id -> ${id}`)
//     const { title, description, price, image , id } = req.body;
//     console.log("Printting req body =>",req.body);

//     // Validate required fields
//     if (!id) {
//       return res.status(400).json({ message: 'Product ID is required' });
//     }

// console.log(id);

//     // Check if all fields are provided
//     if (!title || !description || !price || !image) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Find and update product
//     const updatedProduct = await Product.findByIdAndUpdate({_id:id}, {
//       $set: {
//         title,
//         description,
//         price,
//         image,
//       },
//     }, { new: true });
//     console.log("printing update Producr ->",updatedProduct);

//     // Handle product not found
//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json({
//       message: 'Product updated successfully',
//       data: updatedProduct,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// }
// );



// Signup route

// // second Chanced

app.patch('/fashion_home', async (req, res) => {
  console.log("Requested geted patch");
  try {
    const { title, description, price, image, id } = req.body;
    console.log("Received Request Body:", req.body);

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    // Check if all fields are provided
    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Find and update product
    const updatedProduct = await Product.updateOne(
     {_id: id},  // Pass the objectId directly here
      {
        $set: {
          title,
          description,
          price,
          image,
        },
      },

    );

    console.log("Updated Product:", updatedProduct);

    // Handle product not found
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Server error', error });

  }
});

app.delete("/fashion_home",async(req,res)=>{
  console.log("triggred del api ");
         const { id } = req.body;
         if(!id){
      return res.status(400).json({ message: 'id is required' });}
      try{
        const delProduct  = await Product.deleteOne({_id:id});
    console.log("Product deleted:", delProduct);
    res.status(200).json({
      message: 'Product DelEted successfully',
      data: delProduct,
    });

    //

      }catch(error){

        console.error("Error:", error);
        res.status(500).json({ message: 'Server error', error });
    
         }
})


app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return success response with token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// app.get('/mydata', async (req, res) =>  {
//   try {
//     const studentData = await Children.find();
//     console.log(`student data => ${studentData}`);
//     const data = {students:studentData};
    
//     res.status(200).json(data);  // Send the correct data
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// Login route


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
     // const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
     const token = user._id;
  
      // Return success response with token
      res.status(200).json({ message: 'Login successful', token:`'${token}'` });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  // app.get('/fashon_home',(req,res)=>{
  //   data = fashionData();
  //   res.status(200).json(data);
  // })

// Start the server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


function fashionData(){
    
var data = {fashionData : [ {
    'image':"https://images.pexels.com/photos/5710141/pexels-photo-5710141.jpeg?auto=compress&cs=tinysrgb&w=400",
    'title':"white top scarp",
    'description':"this is white top",
    'price':'1200'
}
,{
    'image':"https://images.pexels.com/photos/5325554/pexels-photo-5325554.jpeg?auto=compress&cs=tinysrgb&w=400",
    'title':"white top",
    'description':"this is white top",
    'price':'1200'
}
,{
    'image':"https://images.pexels.com/photos/5560014/pexels-photo-5560014.jpeg?auto=compress&cs=tinysrgb&w=400",
    'title':"jeans top",
    'description':"this is jeans top",
    'price':'1200'
}
,{
    'image':"https://images.pexels.com/photos/28049936/pexels-photo-28049936/free-photo-of-dame-in-sultry-dress.jpeg?auto=compress&cs=tinysrgb&w=400",
    'title':"wools dress",
    'description':"this is wools dress",
    'price':'1200'
}
,{
    'image':"https://images.pexels.com/photos/27239709/pexels-photo-27239709/free-photo-of-outfit.png?auto=compress&cs=tinysrgb&w=400",
    'title':"checked top",
    'description':"this is checked top",
    'price':'1200'
}
,{
    'image':"https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?auto=compress&cs=tinysrgb&w=400",
    'title':"pink top",
    'description':"this is Pink top",
    'price':'1200'
}

]};
return data;
}


