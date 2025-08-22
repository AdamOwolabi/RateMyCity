// Test the new city recommendation parsing
const testResponse = `
**Understanding Your Needs:** I can see you're a recent graduate interested in both career opportunities and cultural experiences, particularly museums and historical sites.

**Top 3 Cities Balancing Career + Lifestyle:**

**1. Boston, Massachusetts - Overall Score: 8.8/10 for Recent Graduate + Cultural Interests**
- **Employment Highlights:** 3.2% unemployment rate, $78,000 average salary, strong job growth in biotech and healthcare
- **Lifestyle Match:** Rich historical heritage with world-class museums like the Museum of Fine Arts and numerous historical sites
- **Best For:** Recent graduates in healthcare, biotech, and education fields with strong cultural interests
- **Industries:** Education, Healthcare, Biotechnology, Finance
- **Pros:** Excellent university connections, strong alumni networks, walkable historic neighborhoods
- **Cons:** High cost of living, competitive job market, harsh winters
- **Cost Factor:** Housing costs around 40% of salary, but excellent public transportation reduces other expenses

**2. Washington, DC - Overall Score: 8.5/10 for Recent Graduate + Cultural Interests**
- **Employment Highlights:** 4.1% unemployment rate, $82,000 average salary, strong government and consulting opportunities
- **Lifestyle Match:** Unparalleled museums including Smithsonian complex, historical monuments, and cultural institutions
- **Best For:** Recent graduates interested in policy, government, consulting, and non-profit work
- **Industries:** Government, Consulting, Non-profit, Technology, Media
- **Pros:** Free world-class museums, excellent networking opportunities, metro accessibility
- **Cons:** High cost of living, political atmosphere, limited private sector diversity
- **Cost Factor:** Housing costs around 45% of salary, but many cultural attractions are free

**3. Philadelphia, Pennsylvania - Overall Score: 8.2/10 for Recent Graduate + Cultural Interests**
- **Employment Highlights:** 3.8% unemployment rate, $68,000 average salary, growing healthcare and tech sectors
- **Lifestyle Match:** Rich American history with Independence Hall, excellent art museums, vibrant cultural scene
- **Best For:** Recent graduates seeking affordable cultural city with good entry-level opportunities
- **Industries:** Healthcare, Education, Technology, Manufacturing, Finance
- **Pros:** More affordable than other major cultural cities, strong job growth, excellent food scene
- **Cons:** Limited public transportation outside center city, some neighborhood safety concerns
- **Cost Factor:** Housing costs only 30% of salary, very affordable for a major cultural city

**Next Steps:** Research entry-level positions in your field in these cities, visit their major museums virtually, and connect with recent graduates who've moved to these areas for career advice.
`;

const parseCityRecommendations = (content) => {
    const cities = [];
    const lines = content.split('\n');
    let currentCity = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for city headers like "1. San Francisco, CA - Overall Score: 8.5/10"
      const cityMatch = line.match(/^\*\*(\d+)\.\s*([^-]+)\s*-\s*Overall Score:\s*(\d+\.?\d*)\/10/);
      if (cityMatch) {
        if (currentCity) cities.push(currentCity);
        
        const [cityState] = cityMatch[2].split(',').map(s => s.trim());
        const score = parseFloat(cityMatch[3]);
        
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

console.log('Testing city recommendation parsing...');
const results = parseCityRecommendations(testResponse);
console.log('Parsed cities:', results);
console.log('\nFirst city details:');
console.log(JSON.stringify(results[0], null, 2));
