// src/components/StudentDetail.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { jsPDF } from 'jspdf';
import { IStudent } from './StudentList';
import { Button, Typography, Box, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import toast from 'react-hot-toast';

// UPDATED: Now accepts subject AND topic
const generateQuizPDF = async (studentName: string, subject: string, topic: string) => {
    // Encode components to handle spaces and special characters in URLs
    const encodedSubject = encodeURIComponent(subject);
    const encodedTopic = encodeURIComponent(topic);

    const promise = fetch(`${process.env.REACT_APP_API_URL}/api/quiz?subject=${encodedSubject}&topic=${encodedTopic}`);
    
    toast.promise(
        promise.then(async (response) => {
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch questions');
            }
            const questions = await response.json();
            
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(`${subject}: ${topic} Quiz`, 14, 22);
            doc.setFontSize(12);
            doc.text(`Student: ${studentName}`, 14, 30);
            
            let yPos = 45;
            questions.forEach((q: any, index: number) => {
                const questionText = `${index + 1}. [${q.marks} marks] ${q.text}`;
                const splitText = doc.splitTextToSize(questionText, 180); // wrap text
                if (yPos + (splitText.length * 5) > 280) { // Add new page if needed
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(splitText, 14, yPos);
                yPos += (splitText.length * 5) + 8;
            });
            doc.save(`${studentName}-${topic}-Quiz.pdf`);
            return "Quiz downloaded!"; 
        }),
        {
            loading: `Generating ${topic} quiz...`,
            success: <b>Quiz Generated Successfully!</b>,
            error: (err) => <b>Could not generate quiz: {err.toString()}</b>,
        }
    );
};


const StudentDetail: React.FC<{ student: IStudent; onBack: () => void; }> = ({ student, onBack }) => {
  // FLATTEN the nested progress object for the chart
  const chartData = Object.entries(student.progress).flatMap(([subject, topics]) => 
      Object.entries(topics).map(([topic, accuracy]) => ({
          name: `${subject.substring(0,4)}. - ${topic}`, // Shorten name for readability
          accuracy,
      }))
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back to All Students
      </Button>
      <Typography variant="h5" component="h2">{student.name}'s Dashboard</Typography>

      <Typography variant="h6" sx={{ mt: 4 }}>Overall Topic Performance</Typography>
      <Box sx={{ width: '100%', height: 350, mt: 2 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>Generate Weekly Quiz</Typography>
      {/* NESTED LOOP to create buttons for each topic within each subject */}
      {Object.entries(student.progress).map(([subject, topics]) => (
        <Box key={subject} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" component="div">{subject}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.keys(topics).map((topic) => (
                    <Button
                        key={topic}
                        variant="contained"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => generateQuizPDF(student.name, subject, topic)}
                    >
                        {topic}
                    </Button>
                ))}
            </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default StudentDetail;