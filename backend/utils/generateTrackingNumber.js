const axios = require('axios');
const crypto = require('crypto');

const generateRandomTrackingNumber = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomBytes = crypto.randomBytes(4); // Using 4 bytes for randomness This enhances the unpredictability of the generated tracking numbers.
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(randomBytes[i] % chars.length);
    }
    return `RR${result}CN`;
};

const generateTrackingNumber = async (order) => {
    try {
        const options = {
            method: 'POST',
            url: process.env.DELIVERY_URL,
            headers: {
                'content-type': 'application/json',
                '17token': process.env.DELIVERY_TOKEN,
            },
            data: JSON.stringify([
                {
                    "number": generateRandomTrackingNumber(),
                    "carrier": 3011
                },
            ]),
        };

        const response = await axios.request(options);

        // Extract the tracking number from the response
        const acceptedItems = response.data.data.accepted;
        const trackingNumbers = acceptedItems.map(item => item.number);
        console.log(trackingNumbers);
        return trackingNumbers[0];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate tracking number');
    }
};

module.exports = generateTrackingNumber;
