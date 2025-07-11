// src/components/StudentList.tsx

import React from 'react';
// MUI components are imported from the '@mui/material' library
import { Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';

// NEW, UPDATED INTERFACE
export interface IStudent {
  id: number;
  name: string;
  subjects: string[];
  progress: { 
    [subject: string]: { 
      [topic: string]: number 
    } 
  };
}

interface StudentListProps {
  students: IStudent[];
  onSelectStudent: (student: IStudent) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  return (
    <div>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Students</Typography>
      <Grid container spacing={3}>
        {students.map(student => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 }, height: '100%' }} onClick={() => onSelectStudent(student)}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{student.name}</Typography>
                {/* Loop through each SUBJECT in the progress object */}
                {Object.entries(student.progress).map(([subject, topics]) => (
                  <Box key={subject} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>{subject}</Typography>
                    {/* Loop through each TOPIC within that subject */}
                    {Object.entries(topics).map(([topic, percent]) => (
                      <Box key={topic} sx={{ mt: 1, ml: 1 }}>
                        <Typography variant="body2">{topic}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={percent} />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${percent}%`}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default StudentList;