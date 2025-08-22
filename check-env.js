// Environment Variables Check
require('dotenv').config({ path: '.env.local' });

console.log('Checking Environment Variables...\n');

const requiredVars = [
    'PINECONE_API_KEY',
    'GEMINIAI_API_KEY'
];

let allGood = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`${varName}: Set (${value.substring(0, 8)}...)`);
    } else {
        console.log(`${varName}: Missing`);
        allGood = false;
    }
});

console.log('\n' + '='.repeat(50));
if (allGood) {
    console.log('All environment variables are properly configured!');
    console.log('\nNext steps:');
    console.log('1. Run the employment_data_loader.ipynb notebook to set up your database');
    console.log('2. Test your chat API');
} else {
    console.log('Some environment variables are missing.');
    console.log('Please check your .env.local file.');
}
