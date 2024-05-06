const express = require('express');
const mongoose = require('mongoose');
var cors=require('cors');
const path=require('path')
const multer = require('multer');

const bcrypt=require('bcrypt')
const app = express();

const port = 5000;
const storage=multer.diskStorage({
    destination:'../src/uploads/',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})
const upload = multer({ storage: storage });
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.error("MongoDB Connection Error:", error);
});

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('AdminUser', userSchema); 
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await UserModel.create({
            username,
            password: hashedPassword,
            role: role || 'user' // Default role is 'user' if not specified
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user' });
    }
});
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate and return JWT token for authenticated user
        // const token = generateToken(user);
        // res.json({ token });

        res.json({ message: 'User signed in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to sign in' });
    }
});
const AnnotationSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            x1: Number,
            y1: Number,
            x2: Number,
            y2: Number
        },
        required: true
    },
    confidence: {
        type: Number,
        required: true
    }
});

const itemSchema = new Schema({
    fileName: {
        type: String,
    },
    userId: {
        type: String,
       /* required: true*/
    },
    path: {
        type: String,
       /* required: true*/
    },
    annotations: {
        type: [AnnotationSchema],
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const Item = mongoose.model('Item', itemSchema);
app.post('/api/upload', upload.single('image'), (req, res) => {
    // Check if file is provided
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }
    // Create a new Item instance with uploaded image details
    const newItem = new Item({
        fileName: req.file.fileName, 
        userId: req.body.userId||'first', 
        path: req.file.path, // Store file path
        status: req.body.status || 'pending', // Assuming status is sent in request body (default: 'pending')
        annotations: [] // Initialize annotations (if needed)
    });

    // Save the new Item to the database
    newItem.save()
        .then(savedItem => {
            res.status(201).json(savedItem);
        })
        .catch(error => {
            console.error('Error saving item:', error);
            res.status(500).send('Internal Server Error');
        });
});
const imageSchema = new mongoose.Schema({
    filename: String,
    path: String
  });
  
  const Image = mongoose.model('Image', imageSchema);
  
  // Route to handle image upload
  app.post('/upload', upload.single('image'), async (req, res) => {
    console.log(req.file.filename)
    try {
      const newImage = new Image({
        filename: req.file.filename,
        path: req.file.path
      });
      await newImage.save();
      res.status(201).send('Image uploaded successfully');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  
app.get('/api/items', (req, res) => {
    Item.find()
        .then(items => {
            if (items.length === 0) {
                res.status(404).send('No items found');
            } else {
                res.json(items);
            }
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
