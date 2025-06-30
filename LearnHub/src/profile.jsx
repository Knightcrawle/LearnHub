import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../controller/authController';
import axios from 'axios';
import './profile.css';

function Profile() {
  const { state } = useLocation();
  const lecturer = state?.lecturer;
  const navigate = useNavigate();
  const { curUser } = useAuth();
  const [courses, setCourses] = useState([]);

  

  const isUser = curUser?.role !== 'admin';

  const [ setLoadingCourses] = useState(true);

  useEffect(() => {
  axios.get('http://localhost:8001/courses')
    .then(res => {
      setCourses(res.data);
      setLoadingCourses(false);
    })
    .catch(err => {
      console.error("Error fetching courses:", err);
      setLoadingCourses(false);
    });
}, []);


  const getCourseName = (id) => {
  const course = courses.find(c => c._id?.toString() === id?.toString());
  if (!course) {
    console.warn("Course not found for ID:", id);
  }
  return course ? course.name : 'Unknown Course';
};


  return (
    <div className="profile-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

      {/* Lecturer Profile Section */}
      {lecturer && (
        <>
          <div className="profile-dashboard">
            <div className="profile-left">
              <img
                src={lecturer.profile || '/person-circle.svg'}
                alt="Lecturer"
                className="profile-pic"
              />
            </div>

            <div className="profile-right">
              <h2>{lecturer.profName}</h2>
              <p className="designation">{lecturer.title}</p>

              <div className="btn-group">
                <a href={lecturer.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="btn linkedin">LinkedIn</a>
                <a href={lecturer.twitter || '#'} target="_blank" rel="noopener noreferrer" className="btn twitter">Twitter</a>
                <a href={`mailto:${lecturer.email}`} className="btn email">Email</a>
              </div>
            </div>
          </div>

          <div className="lecturer-details-box">
            <h4><strong>Email:</strong></h4> <p>{lecturer.email}</p>
            <h4><strong>Designation:</strong></h4> <p>{lecturer.title}</p>
            <h4><strong>Bio:</strong></h4> <p>{lecturer.bio}</p>
            <h4><strong>Institution:</strong></h4> <p>{lecturer.workAt}</p>
            <h4><strong>Experience:</strong></h4> <p>{lecturer.experience}</p>
            <h4><strong>Qualifications:</strong></h4> <p>{lecturer.qualifications}</p>
          </div>
        </>
      )}

      {/* User Section */}
      {isUser && curUser && (
        <div className="user-profile-card">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  style={{ height: "150px", width: "150px" }}
                  src={curUser.image || './src/assets/person-circle.svg'}
                  alt='profile'
                />
            </div>
         

          <div className="user-info">
            <p><strong>🎓 Username:</strong> {curUser.username}</p>
            <p><strong>📧 Email:</strong> {curUser.email}</p>
            <p><strong>🛡️ Role:</strong> {curUser.role}</p>
          </div>

          <hr style={{ margin: '20px 0' }} />

          {/* Ongoing Courses */}
<h3>📚 Ongoing Courses</h3>
{curUser.inProgressCourses?.length > 0 ? (
  <div className="course-card-container">
    {curUser.inProgressCourses.map((item, index) => (
  <div key={index} className="course-card">
         <h4>📘 {getCourseName(item.courseId)}</h4>
       <p>Progress: {item.progress}%</p> 
    <button
      className="btn-continue"
      onClick={() => navigate(`/learning/${item.courseId}`)}
    >
      ▶ Continue Learning
    </button>
     
  </div>
))}
  </div>
) : (
  <p>No ongoing courses.</p>
)}

<hr style={{ margin: '20px 0' }} />

{/* Completed Courses */}
     <h3>✅ Completed Courses</h3>
{curUser.completedCourses?.length > 0 ? (
  <div className="course-card-container">
    {curUser.completedCourses.map((course, index) => (
      <div key={index} className="course-card">
        <h4>📘 {getCourseName(course.courseId?._id || course.courseId)}</h4>

        <p><strong>📅 Completed On:</strong> {new Date(course.completedAt).toLocaleDateString()}</p>
        {course.certificateUrl ? (
          <div className="certificate-actions">
            <a
              href={course.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view"
            >
              🔍 View Certificate
            </a>
            <a
              href={course.certificateUrl}
              download
              className="btn-download"
            >
              ⬇ Download
            </a>
          </div>
        ) : (
          <p style={{ color: 'gray' }}>No certificate available</p>
        )}
      </div>
    ))}
  </div>
) : (
  <p>No completed courses yet.</p>
)}

        </div>
      )}
    </div>
  );
}

export default Profile;


