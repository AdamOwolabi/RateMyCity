// Pinecone Database Inspector
require('dotenv').config({ path: '.env.local' });
const { Pinecone } = require('@pinecone-database/pinecone');

async function inspectDatabase() {
    console.log('Inspecting Pinecone Database...\n');
    
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        // List all indexes
        console.log('Available Indexes:');
        const indexes = await pc.listIndexes();
        console.log(indexes.indexes.map(idx => `  - ${idx.name} (${idx.dimension}D, ${idx.metric})`));
        
        // Check if our expected indexes exist
        const hasRag = indexes.indexes.some(idx => idx.name === 'rag');
        const hasEmploymentRag = indexes.indexes.some(idx => idx.name === 'employment-rag');
        
        console.log('\nExpected Indexes:');
        console.log(`  - rag: ${hasRag ? 'Found' : 'Missing'}`);
        console.log(`  - employment-rag: ${hasEmploymentRag ? 'Found' : 'Missing'}`);
        
        // Check the current 'rag' index if it exists
        if (hasRag) {
            console.log('\nInspecting "rag" index:');
            const ragIndex = pc.index('rag');
            const ragStats = await ragIndex.describeIndexStats();
            console.log(`  Total vectors: ${ragStats.totalVectorCount}`);
            console.log(`  Namespaces: ${Object.keys(ragStats.namespaces || {}).join(', ') || 'None'}`);
            
            if (ragStats.namespaces) {
                Object.entries(ragStats.namespaces).forEach(([namespace, stats]) => {
                    console.log(`    - ${namespace}: ${stats.vectorCount} vectors`);
                });
            }
        }
        
        // Check the employment-rag index if it exists
        if (hasEmploymentRag) {
            console.log('\nInspecting "employment-rag" index:');
            const empIndex = pc.index('employment-rag');
            const empStats = await empIndex.describeIndexStats();
            console.log(`  Total vectors: ${empStats.totalVectorCount}`);
            console.log(`  Namespaces: ${Object.keys(empStats.namespaces || {}).join(', ') || 'None'}`);
            
            if (empStats.namespaces) {
                Object.entries(empStats.namespaces).forEach(([namespace, stats]) => {
                    console.log(`    - ${namespace}: ${stats.vectorCount} vectors`);
                });
            }
        }
        
        console.log('\nDiagnosis:');
        
        if (!hasEmploymentRag) {
            console.log('The "employment-rag" index is missing!');
            console.log('   Your API is trying to connect to "employment-rag" but it doesn\'t exist.');
            console.log('   You need to run the employment_data_loader.ipynb notebook to create it.');
        } else {
            const empIndex = pc.index('employment-rag');
            const empStats = await empIndex.describeIndexStats();
            
            if (empStats.totalVectorCount === 0) {
                console.log('The "employment-rag" index exists but is empty!');
                console.log('   You need to populate it with employment data.');
            } else if (!empStats.namespaces || !empStats.namespaces['employment-data']) {
                console.log('The "employment-rag" index exists but missing "employment-data" namespace!');
                console.log('   Your API is looking for namespace "employment-data" but it doesn\'t exist.');
            } else {
                console.log('The "employment-rag" index looks good!');
                console.log(`   It has ${empStats.namespaces['employment-data'].vectorCount} vectors in the "employment-data" namespace.`);
            }
        }
        
        if (hasRag) {
            console.log('\nQuick Fix Option:');
            console.log('   If you want to use your existing "rag" index temporarily,');
            console.log('   update your API route.js to use:');
            console.log('   - index: "rag" instead of "employment-rag"');
            console.log('   - namespace: "ns1" instead of "employment-data"');
        }
        
    } catch (error) {
        console.error('Error inspecting database:', error.message);
    }
}

inspectDatabase();
