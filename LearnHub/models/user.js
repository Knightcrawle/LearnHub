
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  watchedVideos: [
    {
      courseId: mongoose.Schema.Types.ObjectId,
      videoId: String,
      watchedAt: Date
    }
  ],
  completedCourses: [
    {
      courseId: mongoose.Schema.Types.ObjectId,
      completedAt: Date,
      certificateUrl: String // optional
    }
  ],
  inProgressCourses: [{
    courseId: String,
    progress: Number, 
  }],
});


export default mongoose.model('User', userSchema);


