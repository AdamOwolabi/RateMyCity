'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Card,
  CardContent,
  Rating,
  Divider,
  Chip,
  Container,
  Paper,
  Grid,
  Fade,
  CircularProgress
} from '@mui/material';
import CityCard from '../components/CityCard';
import CityComparison from '../components/CityComparison';

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cityRecommendations, setCityRecommendations] = useState([]);

  const parseCityRecommendations = (content) => {
    const cities = [];
    const lines = content.split('\n');
    let currentCity = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for city headers like "1. San Francisco, CA - Overall Score: 8.5/10"
      const cityMatch = line.match(/^\d+\.\s*([^-]+)\s*-\s*Overall Score:\s*(\d+\.?\d*)/);
      if (cityMatch) {
        if (currentCity) cities.push(currentCity);
        
        const [cityState] = cityMatch[1].split(',').map(s => s.trim());
        const score = parseFloat(cityMatch[2]);
        
        currentCity = {
          name: cityState,
          score: score,
          rating: Math.min(5, Math.round(score / 2)),
          highlights: [],
          pros: [],
          cons: [],
          industries: [],
          bestFor: '',
          costFactor: ''
        };
      }
      
      // Extract details
      if (currentCity && line.startsWith('- **Employment Highlights:**')) {
        currentCity.highlights.push(line.replace('- **Employment Highlights:**', '').trim());
      }
      if (currentCity && line.startsWith('- **Best For:**')) {
        currentCity.bestFor = line.replace('- **Best For:**', '').trim();
      }
      if (currentCity && line.startsWith('- **Industries:**')) {
        currentCity.industries = line.replace('- **Industries:**', '').trim().split(',').map(s => s.trim());
      }
      if (currentCity && line.startsWith('- **Pros:**')) {
        currentCity.pros.push(line.replace('- **Pros:**', '').trim());
      }
      if (currentCity && line.startsWith('- **Cons:**')) {
        currentCity.cons.push(line.replace('- **Cons:**', '').trim());
      }
      if (currentCity && line.startsWith('- **Cost Factor:**')) {
        currentCity.costFactor = line.replace('- **Cost Factor:**', '').trim();
      }
    }
    
    if (currentCity) cities.push(currentCity);
    return cities.sort((a, b) => b.rating - a.rating);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ role: 'user', content: message }])
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      const processText = async ({ done, value }) => {
        if (done) {
          setIsLoading(false);
          const cities = parseCityRecommendations(fullResponse);
          setCityRecommendations(cities);
          return fullResponse;
        }

        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        fullResponse += text;
        
        const result = await reader.read();
        return processText(result);
      };

      const result = await reader.read();
      await processText(result);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleViewMore = (cityName) => {
    router.push(`/city/${encodeURIComponent(cityName)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Find Your Perfect City
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 300, 
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            AI-powered city recommendations based on your career goals and lifestyle preferences
          </Typography>
          
          {/* Search Input */}
          <Paper 
            elevation={8}
            sx={{ 
              p: 2, 
              maxWidth: 700, 
              mx: 'auto',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tell us about yourself: I'm a recent graduate who loves museums and wants tech opportunities..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' }
                }
              }}
              InputProps={{
                sx: { fontSize: '1.1rem' }
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              sx={{ 
                minWidth: 120,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Discover Cities'}
            </Button>
          </Paper>

          {/* Quick Stats */}
          <Grid container spacing={4} sx={{ mt: 6, maxWidth: 800, mx: 'auto' }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>50+</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>Cities Analyzed</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>AI</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>Powered Insights</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>100%</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>Free to Use</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {cityRecommendations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
              🚀 Ready to Find Your Dream City?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Our AI analyzes employment opportunities, cost of living, cultural attractions, and lifestyle factors to recommend the perfect cities for your unique situation.
            </Typography>
            
            {/* Features Grid */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>💼</Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Career Opportunities
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find cities with thriving job markets in your industry, competitive salaries, and growth potential.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>🎨</Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Lifestyle Match
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover cities that align with your interests in culture, recreation, dining, and entertainment.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>💰</Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Cost Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get detailed insights on cost of living, housing prices, and salary-to-expense ratios.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            {/* Results Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Your Perfect City Matches
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Personalized recommendations based on your preferences
              </Typography>
            </Box>

            {/* Comparison Overview */}
            <CityComparison cities={cityRecommendations} />
            
            {/* Individual City Cards */}
            <Box sx={{ mt: 6 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 4,
                  textAlign: 'center',
                  color: '#1e293b'
                }}
              >
                Detailed City Analysis
              </Typography>
              <Grid container spacing={3}>
                {cityRecommendations.map((city, index) => (
                  <Grid item xs={12} key={index}>
                    <CityCard 
                      city={city} 
                      onViewMore={handleViewMore}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* CTA Section */}
            <Box sx={{ textAlign: 'center', mt: 8, py: 6, bgcolor: '#f1f5f9', borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Want to explore more cities?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Refine your search or ask about specific requirements
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  setMessage('');
                  setCityRecommendations([]);
                }}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
                }}
              >
                Start New Search
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}