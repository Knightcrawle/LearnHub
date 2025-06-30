import React from 'react';
import jsPDF from 'jspdf';
import logo from '/src/assets/logo.jpeg';
import sign from '/src/assets/sign.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../controller/authController';


function CertificatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};
  const { curUser } = useAuth(); // ✅ Get user from context

  const isCourseCompleted = curUser?.completedCourses?.some(
     (c) => c.courseId === course._id
   );

 const handleDownload = async () => {
  if (!curUser || !curUser.username) {
    alert('User information not found. Please login again.');
    return;
  }

  alert('Generating your certificate...');

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'A4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const center = pageWidth / 2;

  // Border
  doc.setDrawColor('#999');
  doc.setLineWidth(2);
  doc.rect(20, 20, pageWidth - 40, 550);

  // Logo
  doc.addImage(logo, 'JPEG', center - 50, 40, 100, 100);

  // Certificate text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('Certificate of Completion', center, 170, null, null, 'center');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('This certifies that', center, 220, null, null, 'center');

  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text(curUser.username, center, 260, null, null, 'center');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.text('has successfully completed the course', center, 300, null, null, 'center');

  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.text(course?.name || 'Unnamed Course', center, 340, null, null, 'center');

  // Footer date and signature
  const dateY = 480;
  doc.setFontSize(14);
  doc.setFont('courier', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 60, dateY);

  doc.addImage(sign, 'JPG', pageWidth - 220, dateY - 40, 100, 40);
  doc.line(pageWidth - 220, dateY, pageWidth - 120, dateY);
  doc.text('LearnHub CEO', pageWidth - 170, dateY + 20, null, null, 'center');

  const fileName = `${curUser.username}_Certificate.pdf`;
  doc.save(fileName);

  // 🔄 After downloading, mark as completed in backend
  try {
    const res = await fetch('http://localhost:8001/api/complete-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: curUser._id,
        courseId: course._id,
        certificateUrl: fileName, // optional, you can ignore or store
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Course marked as completed and certificate saved!");
    } else {
      alert("⚠️ Certificate downloaded but failed to save: " + data.message);
    }
  } catch (error) {
    console.error('❌ Completion save failed:', error);
    alert('Certificate downloaded, but failed to save to server.');
  }
};


  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        background: '#fefce8',
        height: '100vh',
        position: 'relative',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#e0e7ff',
          color: '#1e3a8a',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ← Back
      </button>

      <div className="mt-5">
        <h1 style={{ fontSize: '36px', color: '#d97706' }}>🎉 Congratulations!</h1>
        <p style={{ fontSize: '20px' }}>
          You've completed the <strong>{course?.name}</strong> course.
        </p>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Download your certificate below.
        </p>

        {/* 🎓 JS-generated certificate */}
        <button
           onClick={handleDownload}
           disabled={isCourseCompleted}
           style={{
              padding: '12px 28px',
              fontSize: '18px',
              backgroundColor: isCourseCompleted ? '#d1d5db' : '#10b981',
              color: isCourseCompleted ? '#4b5563' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isCourseCompleted ? 'not-allowed' : 'pointer',
           }}
        >
          {isCourseCompleted ? '✅ Already Downloaded' : '🎓 Download Certificate'}
        </button>

        {/* 🔗 Static certificate file download */}
        <a
          href={`/certificates/${course?._id}.pdf`}
          download
          style={{
            display: 'block',
            marginTop: '20px',
            color: '#2563eb',
            fontSize: '16px',
            textDecoration: 'underline',
          }}
        >
          🔗 Or click here to download static certificate
        </a>
      </div>
    </div>
  );
}

export default CertificatePage;
