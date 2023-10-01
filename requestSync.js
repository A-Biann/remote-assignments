const request = require('sync-request');
const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";

function requestSync(url) {
    const startTime = new Date().getTime();

    try {
        const res = request('GET', url);
        const endTime = new Date().getTime();
        const executionTime = endTime - startTime;

        // get response data
        const responseData = res.getBody('utf8');

        console.log(`Synchronous Request Execution Time: ${executionTime} ms`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const startTime = new Date().getTime();
// Perform synchronous requests
requestSync(url);
requestSync(url);
requestSync(url);
const endTime = new Date().getTime();
console.log(`Total time(ms): ${endTime - startTime}`);
