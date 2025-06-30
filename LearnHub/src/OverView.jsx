import { useLocation, useNavigate } from 'react-router-dom';
import './overview.css';
import { useAuth } from '../controller/authController';
import axios from 'axios';

function OverView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const { curUser } = useAuth();
  
  const lecturer = course?.professor;
  const isAdmin = curUser?.role === 'admin';
  const isCompleted = curUser?.completedCourses?.some((e)=> e.courseId === course._id);

  if (!course) {
    navigate('/CourseList');
    return null;
  }

  const handlePage = () => {
    if (course?.type?.toLowerCase() === 'paid' && !isAdmin) {
      navigate('/PaymentPage', { state: { course } });
    } else {
      navigate('/LearningPage', { state: { course } });
    }
  };

  const handleMarkComplete = async () => {
    try {
      await axios.post('http://localhost:5000/api/markComplete', {
        userId: curUser._id,
        courseId: course._id,
      });
      alert('Course marked as complete!');
      navigate('/CourseList'); // Refresh course list
    } catch (err) {
      console.error('Failed to mark as complete', err);
    }
  };

  return (
    <div className="learning-container">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/CourseList')}>⬅ Back</button>

        <div className="course-content">
          <h2 className="text-center mb-4">{course.name}</h2>

          <div className="video-container mb-4">
            <img
              src={course.image || '/default-course-image.jpg'}
              alt="Course Preview"
            />
          </div>

          <div className="course-details mb-4">
            <p><strong>Type:</strong> {course.type}</p>
            {course.type.toLowerCase() === 'paid' && (
              <p><strong>Price:</strong> ₹{course.price}</p>
            )}
            <p><strong>Duration:</strong> {course.period}</p>
            {course.level && <p><strong>Level:</strong> {course.level}</p>}
            {course.category && <p><strong>Category:</strong> {course.category}</p>}
            <p><strong>Description:</strong> {course.description || `Learn more about ${course.name} in detail through curated materials and interactive lessons.`}</p>
          </div>

          {lecturer && (
            <div
              className="lecturer-details mb-4 hover-card"
              onClick={() => navigate('/profile', { state: { lecturer } })}
            >
              <div className="lecturer-row">
                <img
                  src={lecturer.profile || '/person-circle.svg'}
                  alt="Lecturer"
                  className="lecturer-icon"
                />
                <div className="lecturer-text">
                  <h5><strong>Lecturer Info</strong></h5>
                  <p><strong>Name:</strong> {lecturer.profName}</p>
                  <p><strong>Title:</strong> {lecturer.title}</p>
                </div>
              </div>
            </div>
          )}

          <div className="modules">
            <h4>📘 Modules:</h4>
            {course.modules?.length ? (
              <ul>
                {course.modules.map((mod, i) => (
                  <li key={i}>{mod}</li>
                ))}
              </ul>
            ) : (
              <ul>
                <li>Module 1: Introduction</li>
                <li>Module 2: Core Concepts</li>
                <li>Module 3: Practical Examples</li>
                <li>Module 4: Quiz & Assessment</li>
              </ul>
            )}
          </div>

          <div className="button-row">
            <button className="btn-start" onClick={handlePage}>▶️ Start Learning</button>

            {isCompleted ? (
              <button className="btn btn-success" disabled>
                
                ✅ Completed
              </button>
            ) : (
              <button className="btn-complete" onClick={handleMarkComplete}>
                ✅ Mark as Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverView;
