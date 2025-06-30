// src/components/StudentDetail.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { IStudent } from './StudentList';
// MUI Imports
import { Button, Typography, Box, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// ... your generateQuizPDF function remains the same ...

const StudentDetail: React.FC<any> = ({ student, onBack }) => {
  const chartData = Object.entries(student.progress).map(([topic, accuracy]) => ({
    name: topic,
    accuracy,
  }));

  return (
    <Paper sx={{ p: 3 }}> {/* p = padding */}
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back to All Students
      </Button>
      <Typography variant="h5" component="h2">{student.name}'s Dashboard</Typography>

      <Typography variant="h6" sx={{ mt: 4 }}>Progress by Topic</Typography>
      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>Generate Weekly Quiz</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {student.topics.map((topic: string) => (
          <Button
            key={topic}
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => { /* your generateQuizPDF logic here */ }}
          >
            {topic} Quiz
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default StudentDetail;