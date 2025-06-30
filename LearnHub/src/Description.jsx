import { useNavigate } from 'react-router-dom';
import { useAuth } from '../controller/authController'
import learnHubImage from './assets/3722306.jpg'; // ✅ Use proper image import

function Description() {
  const navigate = useNavigate();
  const { curUser } = useAuth();

  function HandleCourse() {
    if (!curUser) {
      alert('LogIn to access the course');
      return navigate('/Login');
    }
    navigate('/CourseList');
  }

  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }}>
      <div className="container min-vh-100">
        <div className="shadow-lg border-0 rounded-4 p-4 bg-white">
          <div className="text-center mb-5">
            <h2 className="text-primary fw-bold display-5">Welcome to LearnHub</h2>
            <p className="text-muted fs-5">Empowering Lifelong Learners Everywhere</p>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src={learnHubImage}
                alt="Illustration representing LearnHub's e-learning platform"
                className="img-fluid rounded-4 shadow-sm"
              />
            </div>
            <div className="col-md-6">
              <p className="fs-5">
                <strong>LearnHub</strong> is your digital destination for mastering modern skills, from technology to creativity and beyond.
                We offer a platform where users can explore interactive courses, real-world projects, and get certified by industry professionals.
              </p>
              <ul className="list-unstyled fs-5">
                <li>✅ 100+ Curated Courses</li>
                <li>📅 Flexible Schedules & Self-paced Learning</li>
                <li>💼 Industry Projects & Case Studies</li>
                <li>📜 Certification on Completion</li>
              </ul>
              <button className="btn btn-primary mt-3 px-4 py-2 rounded-pill" onClick={HandleCourse}>
                {curUser ? 'Go to Courses' : 'Log In to Explore Courses'}
              </button>
            </div>
          </div>

          <div className="mb-5 text-center">
            <h3 className="fw-bold text-dark mb-3">Our Vision</h3>
            <p className="text-muted fs-5 px-md-5">
              To democratize education by making quality learning resources accessible and affordable for everyone, anywhere in the world.
              We believe in building a community of learners, educators, and innovators.
            </p>
          </div>

          <div className="row text-center mb-5">
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-light rounded-4 shadow-sm h-100">
                <i className="bi bi-laptop display-5 text-primary mb-3"></i>
                <h5 className="fw-bold">Interactive Courses</h5>
                <p>Experience hands-on learning with quizzes, exercises, and real-world examples.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-light rounded-4 shadow-sm h-100">
                <i className="bi bi-clock-history display-5 text-success mb-3"></i>
                <h5 className="fw-bold">Learn Anytime</h5>
                <p>Flexible access to learning content — whenever, wherever you want.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-light rounded-4 shadow-sm h-100">
                <i className="bi bi-award-fill display-5 text-warning mb-3"></i>
                <h5 className="fw-bold">Get Certified</h5>
                <p>Earn shareable certificates recognized by leading employers.</p>
              </div>
            </div>
          </div>

          {/* ✅ Optional Statistics Section */}
          <div className="row text-center mb-5">
            <div className="col-md-4">
              <h1 className="text-primary">10k+</h1>
              <p>Students Enrolled</p>
            </div>
            <div className="col-md-4">
              <h1 className="text-success">500+</h1>
              <p>Hours of Content</p>
            </div>
            <div className="col-md-4">
              <h1 className="text-warning">4.9⭐</h1>
              <p>Average Course Rating</p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="fw-bold text-dark mb-3">Why Choose LearnHub?</h3>
            <p className="text-muted fs-5">
              Trusted by thousands of learners, LearnHub ensures quality education with engaging content,
              community forums, and support from experienced mentors.
            </p>
            <button className="btn btn-outline-dark mt-3 px-4 py-2 rounded-pill shadow-sm custom-hover-btn">
              Join the Community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Description;

