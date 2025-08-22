// Pinecone Database Diagnostic Script
require('dotenv').config({ path: '.env.local' });
const { Pinecone } = require('@pinecone-database/pinecone');

async function diagnosePinecone() {
    console.log('Diagnosing Pinecone Database...\n');
    
    try {
        // Initialize Pinecone
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        console.log('Successfully connected to Pinecone');
        
        // List all indexes
        console.log('\nAvailable indexes:');
        const indexes = await pc.listIndexes();
        console.log(indexes.indexes?.map(idx => `  - ${idx.name} (${idx.dimension}D, ${idx.metric})`).join('\n') || '  No indexes found');
        
        // Check if our employment-rag index exists
        const targetIndex = 'employment-rag';
        const hasEmploymentIndex = indexes.indexes?.some(idx => idx.name === targetIndex);
        
        if (!hasEmploymentIndex) {
            console.log(`\nIndex "${targetIndex}" not found!`);
            console.log('You need to create the employment-rag index first.');
            
            // Check for old 'rag' index
            const hasOldIndex = indexes.indexes?.some(idx => idx.name === 'rag');
            if (hasOldIndex) {
                console.log('Found old "rag" index - you might be using the wrong index name in your API.');
            }
            return;
        }
        
        console.log(`Found "${targetIndex}" index`);
        
        // Get index stats
        const index = pc.index(targetIndex);
        const stats = await index.describeIndexStats();
        
        console.log('\nIndex Statistics:');
        console.log(`  Total vectors: ${stats.totalVectorCount}`);
        console.log(`  Namespaces: ${Object.keys(stats.namespaces || {}).join(', ') || 'None'}`);
        
        if (stats.namespaces && stats.namespaces['employment-data']) {
            console.log(`  Employment data vectors: ${stats.namespaces['employment-data'].vectorCount}`);
        } else {
            console.log('No "employment-data" namespace found!');
            console.log('You need to load employment data into the database.');
        }
        
        // Test a simple query if data exists
        if (stats.totalVectorCount > 0) {
            console.log('\nTesting database query...');
            try {
                const testResults = await index.namespace('employment-data').query({
                    topK: 1,
                    includeMetadata: true,
                    vector: new Array(768).fill(0.1) // dummy vector for testing
                });
                
                if (testResults.matches && testResults.matches.length > 0) {
                    console.log('Query successful!');
                    console.log(`  Sample city: ${testResults.matches[0].metadata?.city || 'Unknown'}`);
                    console.log(`  Metadata keys: ${Object.keys(testResults.matches[0].metadata || {}).join(', ')}`);
                } else {
                    console.log('Query returned no results');
                }
            } catch (queryError) {
                console.log('Query failed:', queryError.message);
            }
        }
        
    } catch (error) {
        console.error('Pinecone connection failed:', error.message);
        
        if (error.message.includes('401')) {
            console.log('This looks like an API key issue. Check your PINECONE_API_KEY.');
        } else if (error.message.includes('404')) {
            console.log('This might be a region or index name issue.');
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Summary of potential issues:');
    console.log('1. Index "employment-rag" might not exist');
    console.log('2. Namespace "employment-data" might be empty');
    console.log('3. API key or network connectivity issues');
    console.log('4. Vector dimensions mismatch (should be 768)');
    console.log('\nNext step: Run the employment_data_loader.ipynb notebook to set up your database properly.');
}

diagnosePinecone().catch(console.error);
