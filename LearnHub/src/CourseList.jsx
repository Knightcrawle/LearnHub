import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../controller/authController';
import { useNavigate } from 'react-router-dom';

function CourseList() {
  const [courseId, setCourseId] = useState(null);
  const [course, setCourse] = useState([]);
  const { curUser } = useAuth();
  const navi = useNavigate();
  const [update, setUpdate] = useState(false);
  const [change, setChange] = useState(null);
  const [create, setCreate] = useState(false);
  const isAdmin = curUser?.role === 'admin';

  const [ setCompletedIds] = useState([]);

useEffect(() => {
  const fetchCompleted = async () => {
    if (curUser) {
      try {
        const res = await axios.get(`http://localhost:8001/completedCourses/${curUser._id}`);
        setCompletedIds(res.data); // res.data should be: ["courseId1", "courseId2"]
      } catch (err) {
        console.log("Error fetching completed courses:", err);
      }
    }
  };
  fetchCompleted();
}, [curUser]);



  const [newCourse, setNewCourse] = useState({
    name: '', image: '', type: '', price: 0, period: '', description: '',
    videoUrl: '', level: '', category: '',
    professor: {
      profName: '', title: '', bio: '', email: '',
      profile: '', workAt: '', experience: '', qualifications: ''
    }
  });
  
  const fetchCourses = () => {
    axios.get('http://localhost:8001/courses')
      .then((data) => setCourse(data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const HandleUpdate = (course) => {
    setUpdate(true);
    setCourseId(course._id);
    setChange(course);
  };

  const HandleOnchange = (e) => {
    const { name, value } = e.target;
    setChange(prev => ({ ...prev, [name]: value }));
  };

  const useUpdate = async (e) => {
    e.preventDefault();
    const sure = confirm('ADMIN, do you want to update this course?');
    if (sure && courseId) {
      axios.put(`http://localhost:8001/courses/${courseId}`, {
        ...change,
        email: curUser?.email
      }).then(() => {
        alert('Course Updated');
        setUpdate(false);
        fetchCourses();
      }).catch((err) => console.log(err));
    }
  };

  const HandleDelete = async (id) => {
    const sure = confirm('ADMIN, do you want to delete this course?');
    if (sure) {
      axios.delete(`http://localhost:8001/courses/${id}`, {
        data: { email: curUser?.email }
      }).then(() => {
        alert('Course Deleted');
        fetchCourses();
      }).catch((err) => console.log(err));
    }
  };

  const HandleCreate = () => {
    setCreate(!create);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in newCourse.professor) {
      setNewCourse(prev => ({
        ...prev,
        professor: {
          ...prev.professor,
          [name]: value
        }
      }));
    } else {
      setNewCourse(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const courseToSend = { ...newCourse };
  if (courseToSend.type.toLowerCase() === 'free') {
    courseToSend.price = 0;
  }

  const sure = confirm('ADMIN, do you want to add this course?');
  if (!sure) return;

  axios.post('http://localhost:8001/courses', courseToSend)
    .then(() => {
      alert('Course Added');
      setCreate(false);
      setNewCourse({
        name: '', image: '', type: 'Free', price: 0, period: '', description: '',
        videoUrl: '', level: 'Beginner', category: '',
        professor: {
          profName: '', title: '', bio: '', email: '',
          profile: '', workAt: '', experience: '', qualifications: ''
        }
      });
      fetchCourses();
    })
    .catch((err) => {
      console.log("Create error:", err.response?.data || err.message);
      alert('Error creating course');
    });
};


  return (
    <div className="course-section py-5">
      <div className='container'>
        {(create || update) && <div className="blur-overlay"></div>}

        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <button className='btn btn-secondary' onClick={() => navi('/')}>Back</button>
          {isAdmin && (
            <button className='btn btn-success' onClick={HandleCreate}><strong>Create</strong></button>
          )}
        </div>

        {isAdmin && create && (
          <div className="position-fixed p-4 bg-white rounded shadow" style={{ zIndex: 1050, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '300px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className='d-flex justify-content-end'>
              <button className='btn btn-danger' onClick={() => setCreate(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <h4 className='text-center'>New Course</h4>
              {["name", "image", "period", "description", "videoUrl", "category"].map(field => (
                <div key={field}>
                  <label><h5 className='mt-2'>{field.charAt(0).toUpperCase() + field.slice(1)}:</h5></label>
                  <input type="text" name={field} className="form-control mb-2" required value={newCourse[field]} onChange={handleInputChange} />
                </div>
              ))}
              <label><h5>Type:</h5></label>
              <select name="type" className="form-control mb-2" value={newCourse.type} onChange={handleInputChange} required>
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
              {newCourse.type.toLowerCase() === 'paid' && (
                <>
                  <label><h5>Price:</h5></label>
                  <input type="number" name="price" className="form-control mb-2" required value={newCourse.price} onChange={handleInputChange} />
                </>
              )}
              <label><h5>Level:</h5></label>
              <select name="level" className="form-control mb-2" value={newCourse.level} onChange={handleInputChange} required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <h4 className='mt-4 text-center'>Lecturer Details</h4>
              {["profName", "title", "bio", "email", "profile", "workAt", "experience", "qualifications"].map(field => (
                <div key={field}>
                  <label><h5 className='mt-2'>{field}:</h5></label>
                  <input type="text" name={field} className="form-control mb-2" value={newCourse.professor[field]} onChange={handleInputChange} />
                </div>
              ))}

              <button className="btn btn-primary w-100 mt-3"><strong>Create</strong></button>
            </form>
          </div>
        )}

        {isAdmin && update && (
          <div className="position-fixed p-4 bg-white rounded shadow" style={{ zIndex: 1050, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '300px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className='d-flex justify-content-end'>
              <button className='btn btn-danger' onClick={() => setUpdate(false)}>X</button>
            </div>
            <form onSubmit={useUpdate}>
              <h4 className='text-center'>Update Course</h4>
              <label><h5 className='mt-3'>Name :</h5></label>
              <input type="text" name="name" value={change?.name || ''} className="form-control mb-2" onChange={HandleOnchange} required />
              <label><h5>Image URL :</h5></label>
              <input type="text" name="image" value={change?.image || ''} className="form-control mb-2" onChange={HandleOnchange} required />
              <label><h5>Type :</h5></label>
              <select name="type" value={change?.type || ''} className="form-control mb-2" onChange={HandleOnchange} required>
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
              {change?.type?.toLowerCase() === 'paid' && (
                <>
                  <label><h5>Price :</h5></label>
                  <input type="number" name="price" value={change?.price || ''} className="form-control mb-2" onChange={HandleOnchange} required />
                </>
              )}
              <label><h5>Period :</h5></label>
              <input type="text" name="period" value={change?.period || ''} className="form-control mb-3" onChange={HandleOnchange} required />
              <label><h5>Description :</h5></label>
              <input type="text" name="description" value={change?.description || ''} className="form-control mb-2" onChange={HandleOnchange} required />
              <label><h5>Video URL :</h5></label>
              <input type="text" name="videoUrl" value={change?.videoUrl || ''} className="form-control mb-2" onChange={HandleOnchange} required />
              <label><h5>Level :</h5></label>
              <select name="level" value={change?.level || ''} className="form-control mb-2" onChange={HandleOnchange} required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <label><h5>Category :</h5></label>
              <input type="text" name="category" value={change?.category || ''} className="form-control mb-2" onChange={HandleOnchange} required />

              <h4 className='mt-4 text-center'>Lecturer Details</h4>
                 {["profName", "title", "bio", "email", "profile", "workAt", "experience", "qualifications"].map(field => (
                      <div key={field}>
                        <label><h5 className='mt-2'>{field}:</h5></label>
                         <input
                          type="text"
                          name={field}
                          className="form-control mb-2"
                          value={change?.professor?.[field] || ''}
                          onChange={(e) => {
                          const { name, value } = e.target;
                            setChange(prev => ({
                               ...prev,
                               professor: {
                                 ...prev.professor,
                                  [name]: value
                               }
                          }));
                        }}
                      />
                     </div>
                ))}

              <button className="btn btn-primary w-100"><strong>Update</strong></button>
            </form>
          </div>
        )}

        <h2 className="text-center fw-bold text-white mb-5">📚 Available Courses</h2>

        <div className="row g-4">
          {course.length > 0 ? (
            course.map((data) => (
              <div key={data._id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card course-card border-0 shadow-sm h-100">
                  <img src={data.image} className="card-img-top" alt={data.name} style={{ height: '180px', objectFit: 'cover' }} />
                  <div className="card-body text-center d-flex flex-column">
                   <h4 className="card-title fw-semibold mb-2 mt-2">{data.name}</h4>
                    {data.type.toLowerCase() === 'paid' && <b className="text-muted small mb-1 mt-2">₹ {data.price}</b>}
                    <strong className={`badge ${data.type.toLowerCase() === 'free' ? 'bg-success' : 'bg-danger'} mb-2 mt-4`}>{data.type}</strong>
                    <b className="text-muted small mb-3 mt-2">{data.period}</b>
                     {
                  !!curUser?.completedCourses?.some((e) => e.courseId === data._id) && 
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#198754',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 1 
                   }}>
                    ✅ Completed
                  </span>
               }    
                    <button
                      style={{ color: 'white', backgroundColor: '#0d6efd', border: '1.5px solid #0d6efd' }}
                      className="btn btn-outline-primary rounded-pill mt-auto"
                      onClick={() => navi('/OverView', { state: {course: data}})}>Start </button>

                    {isAdmin && (
                      <div className='d-flex justify-content-center gap-2 mt-4'>
                        <button className='btn btn-primary' onClick={() => HandleUpdate(data)}><strong>Update</strong></button>
                        <button className='btn btn-danger' onClick={() => HandleDelete(data._id)}><strong>Delete</strong></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white">
              <p>Loading courses...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseList;

