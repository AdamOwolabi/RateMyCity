// components/CityCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Grid,
  Avatar,
  Divider,
  Button
} from '@mui/material';

const CityCard = ({ city, onViewMore }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#4caf50'; // Green
    if (score >= 6) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Fair';
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        boxShadow: 3,
        borderRadius: 2,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: getScoreColor(city.score), width: 48, height: 48 }}>
              🏙️
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {city.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Score:
                </Typography>
                <Chip 
                  label={`${city.score}/10`}
                  size="small"
                  sx={{ 
                    bgcolor: getScoreColor(city.score),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({getScoreLabel(city.score)})
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Star Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                style={{ 
                  color: i < city.rating ? '#ffd700' : '#e0e0e0',
                  fontSize: 20
                }}
              >
                ⭐
              </span>
            ))}
          </Box>
        </Box>

        {/* Key Highlights */}
        {city.bestFor && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              🎯 Best For:
            </Typography>
            <Typography variant="body2" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
              {city.bestFor}
            </Typography>
          </Box>
        )}

        {/* Industries */}
        {city.industries && city.industries.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              💼 Top Industries:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {city.industries.slice(0, 4).map((industry, index) => (
                <Chip 
                  key={index}
                  label={industry}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Quick Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {city.highlights && city.highlights.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <span style={{ fontSize: '1.2em' }}>📈</span>
                <Typography variant="subtitle2">Employment Highlights:</Typography>
              </Box>
              {city.highlights.map((highlight, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 3, mb: 0.5 }}>
                  • {highlight}
                </Typography>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Pros and Cons */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {city.pros && city.pros.length > 0 && (
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                ✅ Pros:
              </Typography>
              {city.pros.slice(0, 3).map((pro, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
                  • {pro}
                </Typography>
              ))}
            </Grid>
          )}
          
          {city.cons && city.cons.length > 0 && (
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                ⚠️ Cons:
              </Typography>
              {city.cons.slice(0, 3).map((con, index) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
                  • {con}
                </Typography>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Cost Factor */}
        {city.costFactor && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              💰 Cost Factor:
            </Typography>
            <Typography variant="body2" sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 1 }}>
              {city.costFactor}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => onViewMore(city.name)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Explore {city.name.split(',')[0]}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CityCard;
