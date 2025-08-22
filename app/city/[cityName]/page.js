'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Rating,
  Stack,
  CircularProgress
} from '@mui/material';

const cityImages = {
  'San Francisco': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop',
  'New York City': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'Denver': 'https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?w=800&h=600&fit=crop',
  'Seattle': 'https://images.unsplash.com/photo-1541087154888-73d76ac2d1ad?w=800&h=600&fit=crop',
  'Boston': 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=800&h=600&fit=crop',
  'Raleigh': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  'Chicago': 'https://images.unsplash.com/photo-1477414956199-7dafc86a4f1a?w=800&h=600&fit=crop'
};

const cityDetailsData = {
  'San Francisco': {
    population: '873,965',
    medianAge: '38.5',
    averageCommute: '33.4 minutes',
    walkScore: '88/100',
    climate: 'Mediterranean, mild year-round',
    topNeighborhoods: ['SOMA', 'Mission District', 'Castro', 'Pacific Heights'],
    publicTransport: 'Excellent BART and Muni systems',
    culturalAttractions: ['SFMOMA', 'Golden Gate Park', 'Fisherman\'s Wharf', 'Alcatraz Island'],
    description: 'San Francisco is a global technology hub known for its innovation, diverse culture, and stunning bay views. The city offers unparalleled career opportunities in tech while maintaining a vibrant arts and culture scene.'
  },
  'Austin': {
    population: '964,177',
    medianAge: '33.0',
    averageCommute: '24.6 minutes',
    walkScore: '42/100',
    climate: 'Humid subtropical, hot summers',
    topNeighborhoods: ['Downtown', 'South Austin', 'East Austin', 'Zilker'],
    publicTransport: 'Limited, car recommended',
    culturalAttractions: ['South by Southwest', 'Austin City Limits', 'State Capitol', 'Zilker Park'],
    description: 'Austin combines a thriving tech scene with a laid-back culture, famous for its music, food trucks, and "Keep Austin Weird" motto. It offers excellent job growth with relatively affordable living costs.'
  },
  'New York City': {
    population: '8,336,817',
    medianAge: '36.2',
    averageCommute: '41.2 minutes',
    walkScore: '89/100',
    climate: 'Continental, four distinct seasons',
    topNeighborhoods: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'],
    publicTransport: 'Extensive subway and bus system',
    culturalAttractions: ['Metropolitan Museum', 'Broadway', 'Central Park', 'Statue of Liberty'],
    description: 'The city that never sleeps offers unmatched career opportunities across all industries. From Wall Street to Broadway, NYC provides endless networking and cultural experiences.'
  },
  'Denver': {
    population: '715,522',
    medianAge: '34.5',
    averageCommute: '26.1 minutes',
    walkScore: '61/100',
    climate: 'Semi-arid, 300+ days of sunshine',
    topNeighborhoods: ['LoDo', 'Capitol Hill', 'RiNo', 'Highlands'],
    publicTransport: 'Light rail and bus system',
    culturalAttractions: ['Red Rocks Amphitheatre', 'Denver Art Museum', 'Rocky Mountain National Park', 'Craft Breweries'],
    description: 'Denver offers an exceptional work-life balance with easy access to outdoor recreation. The city has a growing tech scene and strong aerospace industry presence.'
  },
  'Seattle': {
    population: '753,675',
    medianAge: '35.1',
    averageCommute: '28.9 minutes',
    walkScore: '73/100',
    climate: 'Oceanic, mild and wet winters',
    topNeighborhoods: ['Capitol Hill', 'Fremont', 'Ballard', 'Queen Anne'],
    publicTransport: 'Light rail, buses, and ferries',
    culturalAttractions: ['Pike Place Market', 'Space Needle', 'Music Experience Project', 'Olympic National Park'],
    description: 'Seattle is a major tech hub home to Amazon and Microsoft, with a thriving coffee culture and access to both mountains and water for outdoor enthusiasts.'
  }
};

export default function CityDetail() {
  const params = useParams();
  const router = useRouter();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const cityName = decodeURIComponent(params.cityName);

  useEffect(() => {
    // Simulate loading city data
    setTimeout(() => {
      const data = cityDetailsData[cityName] || {
        population: 'N/A',
        medianAge: 'N/A',
        averageCommute: 'N/A',
        walkScore: 'N/A',
        climate: 'Information not available',
        topNeighborhoods: [],
        publicTransport: 'Information not available',
        culturalAttractions: [],
        description: 'Detailed information for this city is not available yet.'
      };
      setCityData(data);
      setLoading(false);
    }, 1000);
  }, [cityName]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5" p={3}>
      <Box maxWidth="1200px" mx="auto">
        <Button 
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          ← Back to Recommendations
        </Button>

        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          {cityName}
        </Typography>

        <Grid container spacing={3}>
          {/* Main Image */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <Box
                component="img"
                src={cityImages[cityName] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'}
                alt={cityName}
                width="100%"
                height="400px"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About {cityName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {cityData.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Facts
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Population
                    </Typography>
                    <Typography variant="body1">
                      {cityData.population}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Median Age
                    </Typography>
                    <Typography variant="body1">
                      {cityData.medianAge}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Average Commute
                    </Typography>
                    <Typography variant="body1">
                      {cityData.averageCommute}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Walk Score
                    </Typography>
                    <Typography variant="body1">
                      {cityData.walkScore}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Climate & Transportation */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Climate & Transportation
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Climate
                    </Typography>
                    <Typography variant="body1">
                      {cityData.climate}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Public Transportation
                    </Typography>
                    <Typography variant="body1">
                      {cityData.publicTransport}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Neighborhoods */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Popular Neighborhoods
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {cityData.topNeighborhoods.map((neighborhood, index) => (
                    <Chip 
                      key={index} 
                      label={neighborhood} 
                      variant="outlined" 
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cultural Attractions */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cultural Attractions & Points of Interest
                </Typography>
                <Grid container spacing={2}>
                  {cityData.culturalAttractions.map((attraction, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box 
                        p={2} 
                        border="1px solid #e0e0e0" 
                        borderRadius={2}
                        bgcolor="background.paper"
                      >
                        <Typography variant="body2" textAlign="center">
                          {attraction}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
