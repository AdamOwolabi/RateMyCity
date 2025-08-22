// Check what's in the existing 'rag' index
require('dotenv').config({ path: '.env.local' });
const { Pinecone } = require('@pinecone-database/pinecone');

async function checkRagIndex() {
    console.log('Checking existing "rag" index...\n');
    
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        const index = pc.index('rag');
        const stats = await index.describeIndexStats();
        
        console.log('Current "rag" index stats:');
        console.log(`  Total vectors: ${stats.totalVectorCount}`);
        console.log(`  Namespaces: ${Object.keys(stats.namespaces || {}).join(', ') || 'None'}`);
        
        for (const [namespace, data] of Object.entries(stats.namespaces || {})) {
            console.log(`  ${namespace}: ${data.vectorCount} vectors`);
        }
        
        // Test query in different namespaces
        const namespacesToTest = ['ns1', 'employment-data'];
        
        for (const ns of namespacesToTest) {
            if (stats.namespaces && stats.namespaces[ns]) {
                console.log(`\nTesting query in "${ns}" namespace...`);
                try {
                    const results = await index.namespace(ns).query({
                        topK: 1,
                        includeMetadata: true,
                        vector: new Array(768).fill(0.1)
                    });
                    
                    if (results.matches && results.matches.length > 0) {
                        console.log('Found data!');
                        const sample = results.matches[0];
                        console.log(`  Sample ID: ${sample.id}`);
                        console.log(`  Metadata keys: ${Object.keys(sample.metadata || {}).join(', ')}`);
                        
                        // Check if it has employment data
                        if (sample.metadata?.unemployment_rate) {
                            console.log('Has employment data!');
                        } else {
                            console.log('Missing employment data - using old format');
                        }
                    }
                } catch (queryError) {
                    console.log(`Query in ${ns} failed:`, queryError.message);
                }
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkRagIndex().catch(console.error);
