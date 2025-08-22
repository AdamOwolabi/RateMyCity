// Simple test to check if your Pinecone database is working
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config({ path: '.env.local' });

async function testPinecone() {
    try {
        console.log('Testing Pinecone connection...\n');
        
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        // List all indexes
        const indexes = await pc.listIndexes();
        console.log('Available indexes:', indexes.indexes?.map(idx => idx.name) || []);
        
        // Test the 'rag' index
        if (indexes.indexes?.find(idx => idx.name === 'rag')) {
            console.log('\nFound "rag" index, testing connection...');
            
            const index = pc.index('rag');
            const stats = await index.describeIndexStats();
            
            console.log('Index Statistics:');
            console.log(`  Total vectors: ${stats.totalVectorCount}`);
            console.log(`  Namespaces: ${Object.keys(stats.namespaces || {})}`);
            
            // Test query with ns1 namespace
            if (stats.namespaces?.ns1) {
                console.log(`\nTesting query in ns1 namespace...`);
                console.log(`  Vectors in ns1: ${stats.namespaces.ns1.vectorCount}`);
                
                // Try a test query
                const testResults = await index.namespace('ns1').query({
                    vector: new Array(768).fill(0.1), // dummy vector
                    topK: 1,
                    includeMetadata: true
                });
                
                if (testResults.matches?.length > 0) {
                    console.log('\nTest query successful!');
                    console.log('Sample data:', testResults.matches[0].metadata);
                } else {
                    console.log('\nNo results from test query');
                }
            }
        } else {
            console.log('\n"rag" index not found!');
            console.log('Available indexes:', indexes.indexes?.map(idx => idx.name) || 'None');
        }
        
    } catch (error) {
        console.error('Error testing Pinecone:', error.message);
    }
}

testPinecone();
