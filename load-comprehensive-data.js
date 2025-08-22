const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path: '.env.local'});
const fs = require('fs');

// Real city data based on publicly available information
const COMPREHENSIVE_CITY_DATA = [
  {
    city: "Boston",
    state: "MA",
    population: 695506,
    description: "Boston is America's intellectual and historical capital, home to 35 universities including Harvard and MIT. The Freedom Trail connects 16 historical sites including the Boston Tea Party location and Paul Revere's House. World-class museums like the Museum of Fine Arts and Isabella Stewart Gardner Museum showcase art and culture. Strong biotech, healthcare, and finance industries create excellent career opportunities.",
    historical_significance: "Founded in 1630, Boston played a pivotal role in the American Revolution. Site of the Boston Massacre, Boston Tea Party, and the beginning of the midnight ride of Paul Revere.",
    cultural_attractions: ["Freedom Trail", "Museum of Fine Arts", "USS Constitution", "Harvard University", "MIT", "Fenway Park", "Symphony Hall"],
    employment: {
      unemployment_rate: 3.2,
      median_salary: 68000,
      job_growth: 2.8,
      top_industries: ["Biotechnology", "Healthcare", "Education", "Finance", "Technology"]
    },
    cost_of_living: {
      index: 149,
      median_rent: 2800,
      median_home_price: 720000
    },
    demographics: {
      median_age: 32.1,
      college_educated: 47.8
    },
    climate: "Four distinct seasons, cold winters, warm summers",
    life_stage_scores: {
      recent_graduate: 9.2,
      mid_career: 8.8,
      career_change: 8.3,
      family_starting: 7.5,
      cultural_enthusiast: 9.5
    }
  },
  {
    city: "Philadelphia",
    state: "PA",
    population: 1608162,
    description: "Philadelphia is the birthplace of American democracy, where both the Declaration of Independence and Constitution were signed. Independence Hall, Liberty Bell, and numerous colonial-era buildings preserve America's founding story. Rich cultural scene with world-class museums, vibrant neighborhoods like Old City and Fishtown, and a thriving food culture. Strong healthcare and education sectors provide stable employment.",
    historical_significance: "Founded in 1682, Philadelphia served as the nation's capital and is where the Declaration of Independence and Constitution were signed. Home to the Liberty Bell and Independence Hall.",
    cultural_attractions: ["Independence Hall", "Liberty Bell", "Philadelphia Museum of Art", "National Constitution Center", "Reading Terminal Market", "Eastern State Penitentiary"],
    employment: {
      unemployment_rate: 4.1,
      median_salary: 56000,
      job_growth: 2.2,
      top_industries: ["Healthcare", "Education", "Manufacturing", "Finance", "Tourism"]
    },
    cost_of_living: {
      index: 108,
      median_rent: 1600,
      median_home_price: 220000
    },
    demographics: {
      median_age: 34.2,
      college_educated: 31.3
    },
    climate: "Humid subtropical, hot summers, mild winters",
    life_stage_scores: {
      recent_graduate: 8.1,
      mid_career: 7.8,
      career_change: 7.5,
      family_starting: 8.5,
      cultural_enthusiast: 9.2
    }
  },
  {
    city: "Washington",
    state: "DC",
    population: 712816,
    description: "The nation's capital offers unparalleled access to American history, politics, and culture. World-class museums like the Smithsonian complex, National Gallery, and Holocaust Memorial Museum are free to visit. Rich in monuments, memorials, and government buildings. Strong job market in government, policy, consulting, and technology with above-average salaries.",
    historical_significance: "Established as the federal capital in 1790, designed by Pierre L'Enfant. Center of American government and home to the White House, Capitol, and Supreme Court.",
    cultural_attractions: ["Smithsonian Museums", "National Gallery of Art", "Kennedy Center", "Lincoln Memorial", "Washington Monument", "Capitol Building", "White House"],
    employment: {
      unemployment_rate: 3.0,
      median_salary: 75000,
      job_growth: 2.5,
      top_industries: ["Government", "Consulting", "Technology", "Non-profit", "Tourism"]
    },
    cost_of_living: {
      index: 152,
      median_rent: 2200,
      median_home_price: 620000
    },
    demographics: {
      median_age: 34.0,
      college_educated: 59.6
    },
    climate: "Humid subtropical, hot humid summers, mild winters",
    life_stage_scores: {
      recent_graduate: 8.8,
      mid_career: 9.5,
      career_change: 8.5,
      family_starting: 7.2,
      cultural_enthusiast: 9.8
    }
  },
  {
    city: "Charleston",
    state: "SC",
    population: 150227,
    description: "Charleston preserves antebellum architecture and Southern history beautifully. Historic plantations, cobblestone streets, and horse-drawn carriage tours showcase centuries of American history. Rainbow Row's colorful Georgian houses and historic markets create a unique atmosphere. Strong tourism industry and growing tech sector. The Charleston Museum is America's first museum.",
    historical_significance: "Founded in 1670, Charleston was a major port for the slave trade and rice/cotton cultivation. Site of the first shots of the Civil War at Fort Sumter.",
    cultural_attractions: ["Historic District", "Rainbow Row", "Magnolia Plantation", "Fort Sumter", "Charleston Museum", "French Quarter", "Waterfront Park"],
    employment: {
      unemployment_rate: 3.5,
      median_salary: 48000,
      job_growth: 3.8,
      top_industries: ["Tourism", "Healthcare", "Technology", "Manufacturing", "Maritime"]
    },
    cost_of_living: {
      index: 112,
      median_rent: 1400,
      median_home_price: 385000
    },
    demographics: {
      median_age: 36.5,
      college_educated: 52.1
    },
    climate: "Humid subtropical, hot humid summers, mild winters",
    life_stage_scores: {
      recent_graduate: 7.2,
      mid_career: 7.0,
      career_change: 7.5,
      family_starting: 8.2,
      cultural_enthusiast: 9.0
    }
  },
  {
    city: "Santa Fe",
    state: "NM",
    population: 87505,
    description: "Santa Fe blends Native American, Hispanic, and Anglo cultures spanning 400 years. Adobe architecture, art galleries, and the Palace of the Governors (oldest continuously occupied public building in the US) create a unique atmosphere. Rich in Pueblo and Spanish colonial history with strong arts community and cultural events. Stunning natural surroundings and unique cultural lifestyle.",
    historical_significance: "Founded in 1610, Santa Fe is the oldest state capital and second-oldest city in the US. Center of Spanish colonial administration and important stop on the Santa Fe Trail.",
    cultural_attractions: ["Palace of the Governors", "Georgia O'Keeffe Museum", "Canyon Road Galleries", "Loretto Chapel", "San Miguel Mission", "Santa Fe Opera", "Plaza"],
    employment: {
      unemployment_rate: 4.5,
      median_salary: 47000,
      job_growth: 2.1,
      top_industries: ["Arts", "Tourism", "Government", "Healthcare", "Film"]
    },
    cost_of_living: {
      index: 118,
      median_rent: 1350,
      median_home_price: 520000
    },
    demographics: {
      median_age: 44.2,
      college_educated: 44.7
    },
    climate: "High desert, four seasons, low humidity, abundant sunshine",
    life_stage_scores: {
      recent_graduate: 6.8,
      mid_career: 7.2,
      career_change: 8.5,
      family_starting: 7.0,
      cultural_enthusiast: 9.8
    }
  },
  {
    city: "San Antonio",
    state: "TX",
    population: 1547253,
    description: "San Antonio preserves Spanish colonial history with the Alamo, San Antonio Missions, and historic downtown. The River Walk connects cultural attractions and restaurants through the city center. Strong Hispanic cultural heritage and growing tech industry. The Alamo and four 18th-century Spanish missions are UNESCO World Heritage sites. Excellent affordability with good job market.",
    historical_significance: "Founded in 1718, San Antonio was a Spanish colonial outpost. Site of the famous 1836 Battle of the Alamo during the Texas Revolution.",
    cultural_attractions: ["The Alamo", "San Antonio Missions", "River Walk", "Pearl District", "Majestic Theatre", "San Antonio Museum of Art", "Historic Market Square"],
    employment: {
      unemployment_rate: 3.6,
      median_salary: 51000,
      job_growth: 3.5,
      top_industries: ["Healthcare", "Military", "Technology", "Tourism", "Manufacturing"]
    },
    cost_of_living: {
      index: 95,
      median_rent: 1200,
      median_home_price: 245000
    },
    demographics: {
      median_age: 33.2,
      college_educated: 28.5
    },
    climate: "Hot semi-arid, very hot summers, mild winters",
    life_stage_scores: {
      recent_graduate: 8.0,
      mid_career: 7.8,
      career_change: 7.5,
      family_starting: 8.7,
      cultural_enthusiast: 8.5
    }
  },
  {
    city: "Savannah",
    state: "GA",
    population: 147780,
    description: "Savannah's Historic District is one of America's largest National Historic Landmark Districts. Antebellum architecture, Spanish moss-draped squares, and preserved 18th-century buildings create a romantic Southern atmosphere. Rich Civil War history and beautiful Victorian architecture. Growing film industry, strong tourism sector, and emerging arts scene.",
    historical_significance: "Founded in 1733, Savannah was Georgia's first city and an important Confederate port during the Civil War. Preserved historic architecture spans three centuries.",
    cultural_attractions: ["Historic District", "Forsyth Park", "Cathedral of St. John the Baptist", "Owens-Thomas House", "Telfair Museums", "Factor's Walk", "City Market"],
    employment: {
      unemployment_rate: 4.0,
      median_salary: 46000,
      job_growth: 2.9,
      top_industries: ["Tourism", "Manufacturing", "Healthcare", "Logistics", "Film"]
    },
    cost_of_living: {
      index: 103,
      median_rent: 1250,
      median_home_price: 275000
    },
    demographics: {
      median_age: 32.6,
      college_educated: 37.8
    },
    climate: "Humid subtropical, hot humid summers, mild winters",
    life_stage_scores: {
      recent_graduate: 7.0,
      mid_career: 6.8,
      career_change: 7.2,
      family_starting: 7.9,
      cultural_enthusiast: 8.8
    }
  },
  {
    city: "Richmond",
    state: "VA",
    population: 230436,
    description: "Richmond balances Civil War history with modern Southern charm. Home to the American Civil War Museum, Virginia Museum of Fine Arts, and historic Hollywood Cemetery where two US presidents are buried. Rich architectural heritage in the Fan District and Church Hill neighborhoods. Growing arts scene, craft brewery culture, and affordable living with good career opportunities.",
    historical_significance: "Capital of the Confederacy during the Civil War, Richmond has significant Civil War sites and monuments. Also important in early American history as Virginia's capital since 1780.",
    cultural_attractions: ["Virginia Museum of Fine Arts", "American Civil War Museum", "Hollywood Cemetery", "Maymont Park", "St. John's Church", "Fan District", "Shockoe Bottom"],
    employment: {
      unemployment_rate: 3.8,
      median_salary: 52000,
      job_growth: 3.1,
      top_industries: ["Healthcare", "Finance", "Government", "Manufacturing", "Education"]
    },
    cost_of_living: {
      index: 102,
      median_rent: 1300,
      median_home_price: 285000
    },
    demographics: {
      median_age: 34.8,
      college_educated: 49.3
    },
    climate: "Humid subtropical, hot summers, mild winters",
    life_stage_scores: {
      recent_graduate: 7.8,
      mid_career: 7.5,
      career_change: 7.8,
      family_starting: 8.8,
      cultural_enthusiast: 8.2
    }
  },
  {
    city: "St. Augustine",
    state: "FL",
    population: 15065,
    description: "America's oldest continuously inhabited European-established settlement with 450+ years of history. Spanish colonial architecture, Castillo de San Marcos fort, and historic narrow streets preserve centuries of heritage. Strong tourism industry centered around historical attractions. Small but charming coastal community with unique historical significance and beautiful beaches nearby.",
    historical_significance: "Founded in 1565, St. Augustine is the oldest continuously inhabited European-established settlement in what would become the United States. Rich Spanish colonial heritage.",
    cultural_attractions: ["Castillo de San Marcos", "Historic St. George Street", "Flagler College", "Lightner Museum", "Fountain of Youth", "Old City Gates", "Spanish Quarter"],
    employment: {
      unemployment_rate: 4.8,
      median_salary: 42000,
      job_growth: 2.2,
      top_industries: ["Tourism", "Education", "Healthcare", "Retail", "Food Service"]
    },
    cost_of_living: {
      index: 108,
      median_rent: 1100,
      median_home_price: 320000
    },
    demographics: {
      median_age: 42.1,
      college_educated: 35.2
    },
    climate: "Humid subtropical, hot humid summers, mild winters, coastal",
    life_stage_scores: {
      recent_graduate: 6.2,
      mid_career: 5.8,
      career_change: 6.5,
      family_starting: 7.2,
      cultural_enthusiast: 9.5
    }
  },
  {
    city: "Williamsburg",
    state: "VA",
    population: 15425,
    description: "Colonial Williamsburg offers immersive American colonial history with living history demonstrations and restored 18th-century buildings. Home to the College of William & Mary, second oldest university in America. Historic Jamestown and Yorktown nearby complete the Historic Triangle. Limited but specialized job market focused on education, tourism, and historical preservation.",
    historical_significance: "Capital of the Virginia Colony from 1699-1780, Williamsburg was where Patrick Henry gave his famous 'Give me liberty or give me death' speech. Carefully restored to colonial appearance.",
    cultural_attractions: ["Colonial Williamsburg", "College of William & Mary", "Governor's Palace", "Capitol Building", "Bruton Parish Church", "DeWitt Wallace Museum", "Merchants Square"],
    employment: {
      unemployment_rate: 4.2,
      median_salary: 45000,
      job_growth: 1.8,
      top_industries: ["Education", "Tourism", "Government", "Healthcare", "Historical Preservation"]
    },
    cost_of_living: {
      index: 115,
      median_rent: 1200,
      median_home_price: 350000
    },
    demographics: {
      median_age: 28.5,
      college_educated: 62.1
    },
    climate: "Humid subtropical, hot summers, mild winters",
    life_stage_scores: {
      recent_graduate: 6.5,
      mid_career: 6.2,
      career_change: 6.8,
      family_starting: 7.8,
      cultural_enthusiast: 9.7
    }
  }
];

async function loadComprehensiveData() {
    console.log('🚀 Loading comprehensive city data with real information...');
    
    try {
        // Initialize services
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const genai = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);
        const model = genai.getGenerativeModel({ model: "text-embedding-004" });
        
        // Use existing index and namespace
        const index = pc.index('rag');
        const namespace = 'ns1';
        
        console.log(`📊 Processing ${COMPREHENSIVE_CITY_DATA.length} cities with detailed information...`);
        
        const vectors = [];
        
        for (const city of COMPREHENSIVE_CITY_DATA) {
            console.log(`📍 Processing ${city.city}, ${city.state}...`);
            
            // Create comprehensive text for embedding
            const comprehensiveText = `
                ${city.city}, ${city.state} - Population: ${city.population.toLocaleString()}
                
                ${city.description}
                
                Historical Significance: ${city.historical_significance}
                
                Cultural Attractions: ${city.cultural_attractions.join(', ')}
                
                Employment: ${city.employment.top_industries.join(', ')} industries with median salary $${city.employment.median_salary.toLocaleString()} and ${city.employment.unemployment_rate}% unemployment rate.
                
                Climate: ${city.climate}
                
                Cost of Living: ${city.cost_of_living.index} index (100 = national average), median rent $${city.cost_of_living.median_rent}, median home price $${city.cost_of_living.median_home_price.toLocaleString()}
                
                Best for: Recent graduates (${city.life_stage_scores.recent_graduate}/10), Mid-career (${city.life_stage_scores.mid_career}/10), Career change (${city.life_stage_scores.career_change}/10), Family starting (${city.life_stage_scores.family_starting}/10), Cultural enthusiasts (${city.life_stage_scores.cultural_enthusiast}/10)
            `;
            
            // Create embedding
            const embeddingResponse = await model.embedContent(comprehensiveText);
            const embedding = embeddingResponse.embedding.values;
            
            // Create comprehensive review text
            const reviewText = `${city.description} Known for ${city.cultural_attractions.slice(0, 3).join(', ')}. ${city.climate}. Strong in ${city.employment.top_industries.slice(0, 2).join(' and ')} with median salaries around $${city.employment.median_salary.toLocaleString()}.`;
            
            // Prepare vector with comprehensive metadata
            vectors.push({
                id: `${city.city}_${city.state}`.replace(/\s+/g, '_'),
                values: embedding,
                metadata: {
                    city: city.city,
                    state: city.state,
                    population: city.population,
                    review: reviewText,
                    stars: Math.min(5, Math.max(1, Math.round((city.life_stage_scores.recent_graduate + city.life_stage_scores.cultural_enthusiast) / 2))),
                    
                    // Historical & Cultural
                    historical_significance: city.historical_significance,
                    cultural_attractions: city.cultural_attractions.join(', '),
                    
                    // Employment data
                    unemployment_rate: city.employment.unemployment_rate,
                    median_salary: city.employment.median_salary,
                    job_growth_rate: city.employment.job_growth,
                    top_industries: city.employment.top_industries.join(', '),
                    
                    // Cost of living
                    cost_of_living_index: city.cost_of_living.index,
                    median_rent: city.cost_of_living.median_rent,
                    median_home_price: city.cost_of_living.median_home_price,
                    
                    // Demographics
                    median_age: city.demographics.median_age,
                    college_educated_percent: city.demographics.college_educated,
                    climate: city.climate,
                    
                    // Life stage scores
                    recent_graduate_score: city.life_stage_scores.recent_graduate,
                    mid_career_score: city.life_stage_scores.mid_career,
                    career_change_score: city.life_stage_scores.career_change,
                    family_starting_score: city.life_stage_scores.family_starting,
                    cultural_enthusiast_score: city.life_stage_scores.cultural_enthusiast
                }
            });
            
            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Upload to Pinecone in batches
        console.log('📤 Uploading to Pinecone database...');
        const batchSize = 5;
        
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            await index.namespace(namespace).upsert(batch);
            console.log(`   ✅ Uploaded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)}`);
        }
        
        // Verify upload
        const stats = await index.describeIndexStats();
        console.log('\n📈 Database Statistics:');
        console.log(`   Total vectors: ${stats.totalVectorCount}`);
        console.log(`   Namespace '${namespace}' vectors: ${stats.namespaces[namespace]?.vectorCount || 0}`);
        
        // Test query
        console.log('\n🧪 Testing with sample query...');
        const testQuery = "I'm a recent graduate looking for cities with deep cultural history";
        const testEmbedding = await model.embedContent(testQuery);
        
        const results = await index.namespace(namespace).query({
            vector: testEmbedding.embedding.values,
            topK: 3,
            includeMetadata: true
        });
        
        console.log('\n🎯 Test Results:');
        results.matches.forEach((match, i) => {
            console.log(`   ${i+1}. ${match.metadata.city}, ${match.metadata.state} (Score: ${match.score.toFixed(3)})`);
            console.log(`      Cultural Score: ${match.metadata.cultural_enthusiast_score}/10`);
            console.log(`      Recent Grad Score: ${match.metadata.recent_graduate_score}/10`);
            console.log(`      Median Salary: $${match.metadata.median_salary?.toLocaleString()}`);
        });
        
        // Save the data for reference
        fs.writeFileSync('comprehensive_city_data.json', JSON.stringify(COMPREHENSIVE_CITY_DATA, null, 2));
        
        console.log('\n🎉 SUCCESS! Comprehensive city data loaded successfully!');
        console.log('💾 Data also saved to comprehensive_city_data.json for reference');
        console.log('🌐 Your RAG system now has rich, detailed information about historically and culturally significant cities');
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
    }
}

// Run the loader
loadComprehensiveData();
