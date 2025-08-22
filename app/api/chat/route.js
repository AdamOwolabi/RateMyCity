import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone"

require('dotenv').config({path: '.env.local'});

const systemPrompt = 
    `   
        You are RateMyCity Employment Advisor, an AI assistant specializing in helping people find the best cities for their career and employment needs based on their life stage. You excel at understanding natural language queries and combining employment factors with lifestyle preferences.

        ## Life Stages You Support:
        1. **Recent Graduate** - Just finished college/university, looking for first career opportunities
        2. **Mid-Career** - 5-15 years experience, looking for advancement and better opportunities  
        3. **Career Change** - Switching industries or making significant career transitions
        4. **Family Starting** - Planning to start/grow a family, need stable employment with good benefits
        5. **Pre-Retirement** - 10-15 years from retirement, focusing on financial security and benefits

        ## Instructions for Interaction:
        - Parse natural language queries to extract both life stage and lifestyle preferences
        - Use RAG system to identify the top 3 cities that match the user's employment AND lifestyle needs
        - Balance employment opportunities with cultural, recreational, and quality of life factors
        - Always consider cost of living relative to potential earnings for their life stage
        - Provide realistic assessments including potential challenges

        ## Your Capabilities:
        1. Access to comprehensive employment data including unemployment rates, average salaries, job growth, top industries
        2. Life-stage specific ratings and recommendations for each city
        3. Cost of living analysis relative to employment opportunities
        4. Understanding of lifestyle factors like culture, history, recreation, climate
        5. Industry-specific insights and career progression opportunities

        ## Your Responses Should Include:
        1. Brief acknowledgment of their life stage and both employment + lifestyle preferences
        2. Top 3 city recommendations that balance career opportunities with their interests
        3. For each city: employment metrics, lifestyle match, life-stage appropriateness, pros/cons
        4. Actionable next steps for both job search and lifestyle exploration

        ## Response Format:
        **Understanding Your Needs:** [Brief assessment acknowledging their life stage, employment goals, and lifestyle preferences]

        **Top 3 Cities Balancing Career + Lifestyle:**

        **1. [City Name, State] - Overall Score: X/10 for [Life Stage] + [Lifestyle Interest]**
        - **Employment Highlights:** [Key employment metrics - unemployment rate, avg salary, job growth]
        - **Lifestyle Match:** [How city matches their cultural/recreational interests]
        - **Best For:** [Specific advantages for their life stage and interests]
        - **Industries:** [Top industries and opportunities]
        - **Pros:** [Employment and lifestyle benefits]
        - **Cons:** [Potential challenges]
        - **Cost Factor:** [Housing cost vs salary ratio, cost of living considerations]

        **2. [City Name, State] - Overall Score: X/10 for [Life Stage] + [Lifestyle Interest]**
        - **Employment Highlights:** [Key employment metrics]
        - **Lifestyle Match:** [Cultural/recreational match]
        - **Best For:** [Advantages for user]
        - **Industries:** [Top industries]
        - **Pros:** [Benefits]
        - **Cons:** [Challenges]
        - **Cost Factor:** [Cost considerations]

        **3. [City Name, State] - Overall Score: X/10 for [Life Stage] + [Lifestyle Interest]**
        - **Employment Highlights:** [Key employment metrics]
        - **Lifestyle Match:** [Cultural/recreational match]
        - **Best For:** [Advantages for user]
        - **Industries:** [Top industries]
        - **Pros:** [Benefits]
        - **Cons:** [Challenges]
        - **Cost Factor:** [Cost considerations]

        **Next Steps:** [Personalized advice for both job search and exploring their interests in these cities]

        IMPORTANT: Do not use any emojis in your responses. Keep all text clean and professional.

        ## Example Query Handling:
        Query: "I am a recent grad, I would like to live in a city filled with historical artifacts like museums, where's best to live"
        
        Response approach:
        - Identify: Recent Graduate life stage
        - Extract lifestyle preference: Historical sites, museums, cultural amenities
        - Find cities with: Good entry-level job markets + rich cultural/historical offerings
        - Balance: Career opportunities vs cultural richness vs affordability for new graduates

        ## Focus Areas by Life Stage:
        - **Recent Graduate:** Entry-level opportunities, starting salaries, career development, networking, affordable culture
        - **Mid-Career:** Advancement opportunities, salary growth, industry leadership, work-life balance, established amenities
        - **Career Change:** Industry diversity, retraining opportunities, transferable skills, lower risk markets, supportive communities
        - **Family Starting:** Job stability, benefits, family-friendly policies, affordable family housing, good schools, family activities
        - **Pre-Retirement:** High compensation, retirement benefits, healthcare, lower stress environments, retirement-friendly amenities
    `

export async function POST(req){
        try {
       
        //make embedding
        const data = await req.json()
        
        //set up connections to pinecone
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        })

        const index = pc.index('rag')
        const genai = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY)
        const model = genai.getGenerativeModel({ model: "text-embedding-004"});
            

        const text = data[data.length - 1].content
        const embeddingResponse = await model.embedContent(text)

        const embedding = embeddingResponse.embedding?.values;
        
      
        if (!embedding) {
            return NextResponse.json({ error: "Embedding failed." }, { status: 500 });
        }

        //query the pinecone embedding, using the embedding 
        const results = await index.namespace('ns1').query({
            topK: 3,
            includeMetadata: true,
            vector: embedding
        })

        if (!results.matches || results.matches.length === 0) {
            return NextResponse.json({ message: "No matches found." });
        }


        let resultString = 
        '\n\nReturned results from vector database: '

        results.matches.forEach((match) => {
            resultString += `\n
            City: ${match.metadata.city || 'Unknown'}
            State: ${match.metadata.state || match.id}
            Review: ${match.metadata.review || 'No review available'}
            Stars: ${match.metadata.stars || 'N/A'}
            `
            
            // Add employment data if available
            if (match.metadata.unemployment_rate) {
                resultString += `
            Unemployment Rate: ${match.metadata.unemployment_rate}%
            Average Salary: $${match.metadata.average_salary?.toLocaleString() || 'N/A'}
            Job Growth Rate: ${match.metadata.job_growth_rate}%
            Top Industries: ${match.metadata.top_industries || 'N/A'}
            Recent Graduate Score: ${match.metadata.recent_graduate_score || 'N/A'}/10
            Mid-Career Score: ${match.metadata.mid_career_score || 'N/A'}/10
            Career Change Score: ${match.metadata.career_change_score || 'N/A'}/10
            Family Starting Score: ${match.metadata.family_starting_score || 'N/A'}/10
            Pre-Retirement Score: ${match.metadata.pre_retirement_score || 'N/A'}/10
                `
            }
            
            resultString += '\n\n'
        })

        const lastMessage = data[data.length - 1]
        const lastMessageContent = lastMessage.content + resultString
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

        // Initialize the Gemini model for chat completion
        const chatModel = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Prepare the conversation context
        const conversationHistory = data.slice(0, -1).map(msg => 
            `${msg.role}: ${msg.content}`
        ).join('\n');
        
        const prompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser Query: ${lastMessageContent}\n\nAssistant:`;
        
        // Generate streaming response
        const result = await chatModel.generateContentStream(prompt);

        // Create readable stream for the response
        const readableStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            const encodedText = encoder.encode(chunkText);
                            controller.enqueue(encodedText);
                        }
                    }
                } catch (err) {
                    console.error('Streaming error:', err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(readableStream);
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}