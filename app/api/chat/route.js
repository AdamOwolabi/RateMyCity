import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from 'openai';

const systemPrompt = 
    `   
        You are RateMyCity, an AI assistant helping students discover the best cities for their needs. Your recommendations are based on attributes like affordability, education, nightlife, job opportunities, safety, climate, and cultural diversity.

        Instructions for Interaction:

        Use a Retrieval-Augmented Generation (RAG) system to identify the top 3 cities that match the user's query.
        For each city, provide a brief explanation highlighting relevant attributes related to the query.
        Maintain a polite, concise, and neutral tone. Avoid overloading the user with information—focus on the most critical details.
        Suggest follow-up questions or refinements if the query is too vague or broad.
        
        ##Your Capabilities:
        1. You have access to a comprehensive database of city reviews, including information such as city name, city state, city stars, and city reviews
        2. You use RAG to retrieve and rank the most relevant professor information based on the studetn's query.
        3. For each query, you providwe information on the top 3 most relevant cities

        ##Your responsies should include
        1. Be conside yet informative, focusinf on the most relevant details for each cities.
        2. Include the City name, city state, city star rating, and a brief summary of notable attraction and characteristics
        3. Highlight any specific aspects of the mentioned in the user's query (e.g city's friendliness, population, and nighlife)
        4. Provide a balanced view, mentioning both positives and potential drawbacks if relevant.

        ##Rersponse format:
        For each query, structure your response as follows:
        
        1. A brief introduction addressing the student's sprecific request.
        2. top 3 Cities Recommendation 
            -Cities Name (State) - Star Rating 
            - Brief Summary of the cities' review, attractions, and any relevant details from reviews.
        3. A concide of conclusion with any additional advice or siggestion fro the student. 

        Guidelines for Recommendations:
        Affordability: Average cost of living, housing, and rent prices.
        Safety: Crime rates and overall public safety.
        Education: Quality of schools and universities.
        Nightlife: Popular venues, activities, and vibrancy.
        Job Opportunities: Employment rates and industries.
        Climate: Weather conditions and seasonal variation.
        Cultural Diversity: Demographic richness and cultural events.
        Example Interaction:

        User Query: I want a city with great universities and affordable housing.
        Response:
        Here are the top 3 cities that match your criteria:

        Boston, MA: Known for prestigious universities like MIT and Harvard, Boston offers world-class education. Housing affordability varies by neighborhood, so research local options.
        Austin, TX: Affordable housing paired with excellent universities like the University of Texas makes Austin an attractive option.
        Ann Arbor, MI: Home to the University of Michigan, this city combines affordable living with a vibrant campus atmosphere.
    `

    export async function POST(req){

        //make embedding
        const data = await req.json()

        const pc = new Pinecone(
            {
                apiKey : process.env.PINECONE_API_KEY,
            })

            // const { GoogleGenerativeAI } = require("@google/generative-ai");

            // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            // const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
            
            // async function run() {
            //     const result = await model.embedContent("What is the meaning of life?");
            //     console.log(result.embedding.values);
            // }
            
            // run();

        const index = pc.index('rag').namespace('ns1')
        const genai = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY)
        const model = genai.getGenerativeModel({ model: "text-embedding-004"});
            

        const text = data[data.length - 1].content
        const embeddingResponse = await model.embedContent(text)

        const embedding = embeddingResponse.embedding.values;


        //query pinecone for similar cities to make embedd
        const results = await index.query({
            topK: 3,
            includeMetadata: true,
            vector: embedding
        })


        let resultString = 
        '\n\nReturned results from vector db (done automatically): '

        results.matches.forEach((match) => {
            resultString += `\n
            City: ${match.id}
            State:  ${match.metadata.state}
            Review: ${match.metadata.review}
            Stars:  ${match.metadata.stars}
            \n\n
            `
        })

        const lastMessage = data[data.length - 1]
        const lastMessageContent = lastMessage.content + resultString
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

       
        //generate data with embedding
        const client = new  GoogleGenerativeAI({
             api_key: process.env.GEMINIAI_API_KEY,
            base_url: "https://generativelanguage.googleapis.com/v1beta/openai/"
            }  
        )


        // Initialize the model (Gemini)
        const model1 = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

        async function generateChatCompletion(systemPrompt, lastDataWithoutLastMessage, lastMessageContent) {
            try {
                const chat = model1.startChat({
                    history: [
                        { role: "user", parts: [{ text: lastMessageContent }] },
                        ...lastDataWithoutLastMessage,
                        { role: "system", parts: [{ text: systemPrompt }] },
                    ],
                });
    
                const result = await chat.sendMessage(lastMessageContent, { stream: true });
    
                console.log(result.response.text());
    
                const stream = new ReadableStream({
                    async start(controller) {
                        const encoder = new TextEncoder();
                        try {
                            for await (const chunk of result) {
                                const content = chunk.choices[0]?.delta?.content;
                                if (content) {
                                    const text = encoder.encode(content);
                                    controller.enqueue(text);
                                }
                            }
                        } catch (err) {
                            controller.error(err);
                        } finally {
                            controller.close();
                        }
                    },
                });
    
                return new NextResponse(stream);
            } catch (error) {
                console.error("Error generating chat completion:", error);
                return new NextResponse("An error occurred while generating chat completion.", { status: 500 });

            }
        }
    
        await generateChatCompletion(systemPrompt, lastDataWithoutLastMessage, lastMessageContent);
    }
       
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // console.log(client)
        // response = client.chat.completions.create(
        //     model="gemini-1.5-flash",
        //     messages=[
        //         {role: 'system', content:systemPrompt},
        //         ...lastDataWithoutLastMessage,
        //         {role: 'user', content: lastMessageContent}
        //     ],
        //     stream=True
        // )

    //create a chat based completion 
        // const completion = await genai.createChatCompletion({
        //     messages:[
        //         {role: 'system', content:systemPrompt},
        //         ...lastDataWithoutLastMessage,
        //         {role: 'user', content: lastMessageContent}
        //     ],
        //     stream: true,
        // })

        // const stream = new ReadableStream({
        //     async start(controller){
        //         const encoder = new TextDecoder()
        //         try{
        //             for await (const chunk of completion){
        //                 const content = chunk.choices[0]?.delta?.content
        //                 if(content){
        //                     const text = ecndoer.encode(content)
        //                     controller.enqueue(text)
        //                 }
        //             }
        //         }catch(err){
        //             controller.error(err)
        //         }finally{
        //             controller.close()
        //         }
        //     },
        // })

        // return new NextResponse(stream)


        // const completion = await GoogleGenerativeAI.chat.completions.create({
        //     messages:[
        //         {role: 'system', content:systemPrompt},
        //         ...lastDataWithoutLastMessage,
        //         {role: 'user', content: lastMessageContent}
        //     ],
        //     stream: true,
        // })
    // }

    // 'id': 'Los Angeles',
    // 'metadata': {'review': 'A vibrant city with endless entertainment and fantastic weather!',
    //  'state': 'California',
    //  'stars': 5}}
