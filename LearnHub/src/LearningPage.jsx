
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { useAuth } from '../controller/authController';

function LearningPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const { curUser } = useAuth();

  const playerRef = useRef(null);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [notes, setNotes] = useState(localStorage.getItem(`notes-${course?._id}`) || '');
  const [videoCompleted, setVideoCompleted] = useState(false);

  const handleSave = () => {
    localStorage.setItem(`notes-${course._id}`, notes);
  };

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    setVideoStarted(true);
  };

  useEffect(() => {
    if (!videoStarted || !playerRef.current) return;

    const intervalId = setInterval(() => {
      const player = playerRef.current;
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (duration > 0) {
        const percentWatched = ((currentTime / duration) * 100).toFixed(2);
        setWatchedPercent(percentWatched);

        if (percentWatched >= 10 && percentWatched % 10 < 1) {
          axios.post('http://localhost:8001/track-progress', {
            userId: curUser._id,
            courseId: course._id,
            progress: percentWatched,
          });
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [videoStarted]);

  const getVideoId = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.split('/')[1];
      }
      return '';
    } catch (e) {
      console.error('Invalid URL:', e);
      return '';
    }
  };

  const handleVideoEnd = async () => {
    setVideoCompleted(true);
    try {
      await axios.post('http://localhost:5000/api/markComplete', {
        userId: curUser._id,
        courseId: course._id
      });
      console.log("Course marked as complete!");
    } catch (err) {
      console.error("Failed to mark complete", err);
    }
  };

  const videoId = getVideoId(course?.videoUrl);
  if (!course) return <div>Course not found</div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to right, #e0f7fa, #e1f5fe)'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <button
          onClick={() => navigate('/CourseList')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Courses
        </button>

        {videoCompleted && (
          <button
            onClick={() => navigate('/certificate', { state: { course } })}
            style={{
              padding: '0.6rem 1.2rem',
              background: '#6f42c1',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎓 Download Certificate
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Lessons Sidebar */}
        <div style={{ width: '20%', background: '#ffffffc2', padding: '1rem', borderRight: '1px solid #ccc' }}>
          <h3>Lessons</h3>
          <ul>
            <li>Intro to {course.name}</li>
            <li>Using Tools</li>
            <li>Building Components</li>
            <li>Practice Task</li>
          </ul>
        </div>

        {/* Center Section - Video + Description */}
        <div style={{ width: '60%', padding: '1rem', overflowY: 'auto' }}>
          <h2>{course.name} - Learning</h2>

          {/* Video Container */}
          <div style={{
            width: '100%',
            height: 'calc(100vh - 250px)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
          }}>
            <YouTube
              videoId={videoId}
              onReady={handlePlayerReady}
              onEnd={handleVideoEnd}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 0,
                  modestbranding: 1,
                  rel: 0
                }
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Progress */}
          <p style={{ marginTop: '10px' }}><strong>Watched:</strong> {watchedPercent}%</p>

          {/* Description */}
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Description:</strong> {course.description || "No description available."}</p>
          </div>
        </div>

        {/* Notes Sidebar */}
        <div style={{ width: '20%', background: '#ffffffc2', padding: '1rem', borderLeft: '1px solid #ccc' }}>
          <h3>Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your notes here..."
            style={{
              width: '100%',
              height: '70%',
              resize: 'none',
              borderRadius: '6px',
              padding: '0.5rem'
            }}
          ></textarea>

          <button
            onClick={handleSave}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '0.5rem',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearningPage;
