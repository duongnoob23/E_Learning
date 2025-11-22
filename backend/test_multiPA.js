/**
 * Test script for MultiPA scoring system
 * Tests both Speaking and Writing scoring
 */

const { scoreResponse, scoreSpeaking, scoreWriting } = require('./src/client/services/multiPAService');

// Test data
const testSpeakingText = `
Hello, my name is John. I am a student from Vietnam. 
I like to study English because it is very important for my future career.
I practice speaking every day by watching English movies and listening to podcasts.
My favorite hobby is reading books and playing sports.
I think learning English is challenging but very rewarding.
`;

const testWritingText = `
The importance of environmental protection cannot be overstated in today's world.
Climate change is one of the most pressing issues facing humanity.
We must take immediate action to reduce carbon emissions and protect our planet.
Governments should implement stricter environmental policies and regulations.
Individuals can also contribute by adopting sustainable practices in their daily lives.
Education about environmental issues is crucial for creating awareness among the younger generation.
`;

async function testSpeakingScoring() {
    console.log('\n=== Testing Speaking Scoring ===');
    try {
        const result = await scoreSpeaking(testSpeakingText, 'en');
        console.log('Speaking Score Result:');
        console.log(JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error in speaking scoring:', error.message);
        return null;
    }
}

async function testWritingScoring() {
    console.log('\n=== Testing Writing Scoring ===');
    try {
        const result = await scoreWriting(testWritingText, 'en');
        console.log('Writing Score Result:');
        console.log(JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error in writing scoring:', error.message);
        return null;
    }
}

async function testGenericScoring() {
    console.log('\n=== Testing Generic Scoring (SPEAKING) ===');
    try {
        const result = await scoreResponse(testSpeakingText, 'SPEAKING', 'en');
        console.log('Generic Speaking Score Result:');
        console.log(JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error in generic scoring:', error.message);
        return null;
    }
}

async function testBatchScoring() {
    console.log('\n=== Testing Batch Scoring ===');
    try {
        const responses = [
            { text: testSpeakingText, type: 'SPEAKING', language: 'en' },
            { text: testWritingText, type: 'WRITING', language: 'en' }
        ];
        
        const { scoreMultiple } = require('./src/client/services/multiPAService');
        const results = await scoreMultiple(responses);
        console.log('Batch Scoring Results:');
        console.log(JSON.stringify(results, null, 2));
        return results;
    } catch (error) {
        console.error('Error in batch scoring:', error.message);
        return null;
    }
}

async function runAllTests() {
    console.log('Starting MultiPA Scoring Tests...');
    console.log('================================');
    
    const speakingResult = await testSpeakingScoring();
    const writingResult = await testWritingScoring();
    const genericResult = await testGenericScoring();
    
    console.log('\n=== Test Summary ===');
    console.log('Speaking Scoring:', speakingResult ? 'PASSED' : 'FAILED');
    console.log('Writing Scoring:', writingResult ? 'PASSED' : 'FAILED');
    console.log('Generic Scoring:', genericResult ? 'PASSED' : 'FAILED');
    
    console.log('\nAll tests completed!');
    process.exit(0);
}

// Run tests
runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});

