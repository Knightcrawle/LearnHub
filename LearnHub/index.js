import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import Admin from './models/admin.js'
import Course from './models/course.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/learnhub')
  .then(() => {
    console.log('DB connected');
    app.listen(8001, () => {
      console.log('Server running on http://localhost:8001');
    });
  })
  .catch(err => console.error('DB connection error:', err));


// Admin Login 
app.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 Admin login attempt: ${email}`);

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log(`✅ Admin Login Success: ${admin.username}`);
    res.status(200).json({ admin });

  } catch (err) {
    console.error("🔥 Server error in admin login:", err);
    res.status(500).json({ message: 'Server error' });
  }
});



// User Login Route
app.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    console.log('User Login Success : ',user.username);
    res.status(200).json({ user });
  } catch (err) {
    console.error('User login error:', err);
    res.status(500).json({ message: 'Server error during user login' });
  }
});

// User Sign-Up Route
app.post('/signup/user', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { username, email } });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ message: 'Server error during sign-up' });
  }
});


app.get('/courses', async (req, res) => {
  const courses = await Course.find(); 
  res.json(courses);
});

app.post('/User/update-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create Course
app.post('/courses', async (req, res) => {
  try {
    const {
      name, image, type, price = 0, period,
      description, videoUrl, level, category, professor
    } = req.body;

    console.log("🛠️ Received course payload:", req.body);

    // Basic required field validation
    if (!name || !image || !type || !period) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const course = new Course({
      name,
      image,
      type,
      price,
      period,
      description,
      videoUrl,
      level,
      category,
      professor
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully' });
  } catch (err) {
    console.error('❌ Course creation error:', err.message);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});



// Update Course
app.put('/courses/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course ID format' });
  }

  const {
    name, image, type, price, period,
    description, videoUrl, level, category,
    professor
  } = req.body;

  const updatedData = {
    name, image, type, price, period,
    description, videoUrl, level, category,
    professor
  };

  try {
    const updated = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course updated successfully', course: updated });
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ message: 'Server error while updating course' });
  }
});

// Delete Course
app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
});


// PUT /api/markComplete/:userId/:courseI
app.put('/markComplete/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const user = await User.findById(userId);
    if (!user.completedCourses.includes(courseId)) {
      user.completedCourses.push(courseId);
      await user.save();
    }
    res.json({ success: true, message: 'Course marked as completed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Example endpoint in Express (Node.js backend)
app.post('/api/complete-course', async (req, res) => {
  const { userId, courseId, certificateUrl } = req.body;

  try {
    const user = await User.findById(userId);

    const alreadyCompleted = user.completedCourses.some(
      (c) => c.courseId.toString() === courseId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    user.completedCourses.push({
      courseId,
      completedAt: new Date(),
      certificateUrl: certificateUrl || ''
    });

    await user.save();
    res.status(200).json({ message: 'Course marked as completed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course completion' });
    console.log(err);
  }
});

// certification profile
app.get('/download-certificate/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;
  const user = await User.findById(userId);
  const courseData = user.completedCourses.find(c => c.courseId.toString() === courseId);

  if (!courseData || !courseData.certificateUrl) {
    return res.status(404).send('Certificate not found');
  }

  res.set({
    'Content-Disposition': `attachment; filename=Certificate-${courseId}.pdf`
  });

  res.redirect(courseData.certificateUrl); 
});

