const https = require('http');

const BASE_URL = 'http://54.166.181.144:3000';
const EMAIL = 'dr.menendez@unihealth.com';
const PASSWORD = 'Doctor123!';

// Helper for HTTP requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    console.log('🚀 Starting API Probe...');

    // 1. Login
    console.log('\n🔑 Logging in...');
    const loginRes = await request('POST', '/auth/login', { email: EMAIL, password: PASSWORD });
    if (loginRes.status !== 201 && loginRes.status !== 200) {
        console.error('❌ Login failed:', loginRes.data);
        return;
    }
    const token = loginRes.data.access_token;
    console.log('✅ Login successful');

    // 2. Probe GET /records/my-history
    console.log('\n🔍 Probing GET /records/my-history...');
    const res = await request('GET', '/records/my-history', null, token);
    console.log(`Status: ${res.status}`);
    if (res.status === 200) {
        console.log('✅ SUCCESS! Found records:', res.data.length);
        if (res.data.length > 0) {
            console.log('Sample record:', JSON.stringify(res.data[0], null, 2));
        } else {
            console.log('⚠️ No records found in my-history');
        }
    } else {
        console.log('❌ Failed:', JSON.stringify(res.data));
    }
}

run().catch(console.error);
