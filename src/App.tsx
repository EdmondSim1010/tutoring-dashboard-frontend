// src/App.tsx
import React, { useState, useEffect } from 'react';
import StudentList, { IStudent } from './components/StudentList';
import StudentDetail from './components/StudentDetail';
// MUI Imports
import { Container, Typography, CssBaseline, CircularProgress, Alert } from '@mui/material';

function App() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... your fetch logic remains the same
    const fetchStudents = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured. Please set REACT_APP_API_URL in .env");
        }
        const response = await fetch(`${apiUrl}/api/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // A much nicer loading and error state!
  if (loading) return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert severity="error" sx={{ margin: '20px' }}>Error: {error}</Alert>;

  return (
    <>
      <CssBaseline /> {/* A nice CSS reset */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* mt = margin-top */}
        <Typography variant="h4" component="h1" gutterBottom>
          Smart Tutor Dashboard
        </Typography>
        {selectedStudent ? (
          <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
        ) : (
          <StudentList students={students} onSelectStudent={setSelectedStudent} />
        )}
      </Container>
    </>
  );
}

export default App;