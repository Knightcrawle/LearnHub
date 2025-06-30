import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: String,
  image: String,
  type: String,
  price: Number,
  period: String,
  description: String,
  videoUrl: String,
  level: String,
  category: String,
  professor: {
    profName: String,
    title: String,
    bio: String,
    email: String,
    profile: String,
    workAt: String,
    experience: String,
    qualifications: String
  }
});

export default mongoose.model('Course', courseSchema);
