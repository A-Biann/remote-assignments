const https = require('https');

const url = "https://ec2-54-64-246-136.ap-northeast-1.compute.amazonaws.com/delay-clock";

// Callback function
function requestCallback(url, callback) {
    const startTime = new Date().getTime();

    https.get(url, (res) => {
        let data = '';

        // get response data
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            callback(`Callback Request Execution Time: ${executionTime} ms`);
        });
    }).on('error', (error) => {
        console.error(`Error: ${error}`);
    });
}

// Promise
function requestPromise(url) {
    const startTime = new Date().getTime();

    // resolve for successful operation, reject for failure
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const endTime = new Date().getTime();
                const executionTime = endTime - startTime;
                resolve(`Promise Request Execution Time: ${executionTime} ms`);
            });
        }).on('error', (error) => {
            reject(`Error: ${error}`);
        });
    });
}

// Async/await
async function requestAsyncAwait(url) {
    const startTime = new Date().getTime();
    try {
        const response = await requestPromise(url);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

// Example usage
requestCallback(url, console.log);
requestPromise(url).then(console.log);
requestAsyncAwait(url);
