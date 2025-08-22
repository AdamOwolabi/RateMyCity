// components/CityComparison.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';

const CityComparison = ({ cities }) => {
  if (!cities || cities.length === 0) return null;

  const getProgressColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  const getMaxScore = () => {
    return Math.max(...cities.map(city => city.score));
  };

  return (
    <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📊 City Comparison Overview
        </Typography>
        
        <Grid container spacing={3}>
          {cities.map((city, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {city.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Score</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {city.score}/10
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(city.score / 10) * 100}
                    color={getProgressColor(city.score)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Rating: {city.rating}/5 ⭐
                  </Typography>
                </Box>

                {city.industries && city.industries.length > 0 && (
                  <Box>
                    <Typography variant="body2" gutterBottom fontWeight="medium">
                      Key Industries:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {city.industries.slice(0, 2).map((industry, idx) => (
                        <Chip 
                          key={idx}
                          label={industry}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            🏆 Winner: {cities.find(city => city.score === getMaxScore())?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on overall score matching your preferences
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CityComparison;
