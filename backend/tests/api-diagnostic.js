/**
 * API DIAGNOSTIC SCRIPT
 * Tests all backend endpoints and validates full-stack integration
 * Run: node tests/api-diagnostic.js
 */

const axios = require('axios');
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://cozy-fulfillment-production.up.railway.app/api' 
  : 'http://localhost:5000/api';

let testToken = null;
let testUserId = null;
let testSubjectId = null;

const log = {
  test: (msg) => console.log(`\n▶️  ${msg}`),
  success: (msg) => console.log(`   ✅ ${msg}`),
  error: (msg) => console.log(`   ❌ ${msg}`),
  info: (msg) => console.log(`   ℹ️  ${msg}`),
  result: (data) => console.log(`   📋 ${JSON.stringify(data, null, 3)}`),
};

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  if (testToken) config.headers.Authorization = `Bearer ${testToken}`;
  return config;
});

const tests = {
  async testAuth() {
    log.test('Testing Authentication Routes (/api/auth)');
    
    try {
      // Test registration
      log.test('Testing User Registration');
      const registerRes = await api.post('/auth/register', {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@benha.edu.eg`,
        password: 'TestPassword123',
        year: 'Year 1'
      });
      
      if (registerRes.data.token && registerRes.data.user) {
        testToken = registerRes.data.token;
        testUserId = registerRes.data.user.id;
        log.success(`User registered: ${registerRes.data.user.name}`);
        log.success(`Token received: ${testToken.substring(0, 20)}...`);
        log.success(`User data: ID=${testUserId}, Role=${registerRes.data.user.role}`);
      } else {
        throw new Error('Invalid response structure');
      }

      // Test login with same credentials
      log.test('Testing User Login');
      const loginRes = await api.post('/auth/login', {
        email: registerRes.data.user.email,
        password: 'TestPassword123'
      });
      
      if (loginRes.data.token && loginRes.data.user) {
        log.success('Login successful');
        log.success(`User role: ${loginRes.data.user.role}`);
        log.success(`User year: ${loginRes.data.user.year}`);
      } else {
        throw new Error('Invalid login response');
      }

    } catch (err) {
      log.error(`Auth tests failed: ${err.response?.data?.msg || err.message}`);
    }
  },

  async testSubjects() {
    log.test('Testing Subject Routes (/api/subjects)');

    try {
      // Get all subjects
      log.test('Fetching All Subjects');
      const getRes = await api.get('/subjects');
      log.success(`Found ${getRes.data.length} subjects`);
      
      if (getRes.data.length > 0) {
        testSubjectId = getRes.data[0]._id;
        log.info(`Using subject for further tests: ${getRes.data[0].name}`);
        log.info(`Subject ID: ${testSubjectId}`);
      }

      // Get subjects by year
      log.test('Fetching Subjects by Year');
      const yearRes = await api.get('/subjects?year=Year 1');
      log.success(`Found ${yearRes.data.length} subjects for Year 1`);

      // Create subject (auth required)
      if (testToken) {
        log.test('Creating New Subject (Requires Auth)');
        try {
          const createRes = await api.post('/subjects', {
            name: `Test Subject ${Date.now()}`,
            code: 'TST101',
            credits: '3',
            year: 'Year 1',
            icon: '📚',
            color: 'rgba(99,102,241,.12)'
          });
          log.success(`Subject created: ${createRes.data.name}`);
          log.success(`Subject ID: ${createRes.data._id}`);
          if (!testSubjectId) testSubjectId = createRes.data._id;
        } catch (err) {
          log.error(`Create subject failed: ${err.response?.data?.msg || err.message}`);
        }
      }

    } catch (err) {
      log.error(`Subject tests failed: ${err.response?.data?.msg || err.message}`);
    }
  },

  async testUsers() {
    log.test('Testing User Routes (/api/users)');

    if (!testToken) {
      log.error('Skipping - requires authentication');
      return;
    }

    try {
      const res = await api.get('/users');
      log.success(`Found ${res.data.length} users`);
      
      if (res.data.length > 0) {
        log.info(`Sample user: ${res.data[0].name} (${res.data[0].role}) - ${res.data[0].year}`);
      }

    } catch (err) {
      log.error(`Users fetch failed: ${err.response?.data?.msg || err.message}`);
    }
  },

  async testMiddleware() {
    log.test('Testing Middleware & Security');

    try {
      // Test unauthorized request to protected route
      log.test('Testing Protected Route (Should Fail Without Token)');
      try {
        await axios.get(`${API_BASE}/users`);
        log.error('Protected route accessible without token - SECURITY ISSUE');
      } catch (err) {
        if (err.response?.status === 401) {
          log.success('Protected route correctly requires authentication');
        } else {
          log.error(`Unexpected error: ${err.response?.status}`);
        }
      }

      // Test invalid token
      log.test('Testing Invalid Token (Should Fail)');
      try {
        const invalidApi = axios.create({
          baseURL: API_BASE,
          headers: { Authorization: 'Bearer invalid_token_12345' }
        });
        await invalidApi.get('/users');
        log.error('Invalid token accepted - SECURITY ISSUE');
      } catch (err) {
        if (err.response?.status === 401) {
          log.success('Invalid token correctly rejected');
        }
      }

    } catch (err) {
      log.error(`Middleware tests failed: ${err.message}`);
    }
  },

  async testCORS() {
    log.test('Testing CORS Configuration');

    try {
      const res = await axios.get(`${API_BASE}/subjects`, {
        headers: { Origin: 'https://genbyte-five.vercel.app' }
      });
      
      const corsHeader = res.headers['access-control-allow-origin'];
      if (corsHeader) {
        log.success(`CORS header present: ${corsHeader}`);
      } else {
        log.info('No explicit CORS header (may be inherited)');
      }

    } catch (err) {
      log.error(`CORS test failed: ${err.message}`);
    }
  },

  async testBodyParsing() {
    log.test('Testing Body Parsing (express.json)');

    try {
      // Send complex JSON to verify express.json is working
      const res = await api.post('/auth/login', {
        email: 'test@example.com',
        password: 'test123'
      });
      
      // Should get proper error, not "body undefined"
      if (res.request?.method === 'POST') {
        log.success('Body parser handling POST requests correctly');
      }

    } catch (err) {
      const msg = err.response?.data?.msg || '';
      if (msg.includes('undefined')) {
        log.error('Body parsing issue: express.json may not be configured correctly');
      } else {
        log.success('Body parsing working (received proper API error)');
      }
    }
  },

  async testErrorHandling() {
    log.test('Testing Error Handling');

    try {
      // Test 404 route
      log.test('Testing 404 Handler');
      try {
        await api.get('/nonexistent-endpoint');
        log.error('404 route not handled');
      } catch (err) {
        if (err.response?.status === 404) {
          log.success('404 errors properly handled');
        }
      }

      // Test validation error
      log.test('Testing Validation Errors');
      try {
        await api.post('/auth/register', {
          name: 'Test',
          // Missing email and password
        });
        log.error('Validation not working');
      } catch (err) {
        if (err.response?.status === 400) {
          log.success(`Validation working: ${err.response.data.msg}`);
        }
      }

    } catch (err) {
      log.error(`Error handling tests failed: ${err.message}`);
    }
  },

  async testEnvironment() {
    log.test('Testing Environment Configuration');

    try {
      const res = await api.get('/subjects');
      log.success('MongoDB connection working');
      log.info(`API is responding from: ${API_BASE}`);
      log.info(`Node environment: ${process.env.NODE_ENV || 'development'}`);

    } catch (err) {
      log.error(`Database/Environment issue: ${err.message}`);
    }
  }
};

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        GENBYTE API DIAGNOSTIC TEST SUITE               ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\nAPI Base URL: ${API_BASE}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  try {
    await tests.testEnvironment();
    await tests.testBodyParsing();
    await tests.testAuth();
    await tests.testSubjects();
    await tests.testUsers();
    await tests.testMiddleware();
    await tests.testCORS();
    await tests.testErrorHandling();

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                   TEST SUITE COMPLETE                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

  } catch (err) {
    log.error(`Test suite failed: ${err.message}`);
  }

  process.exit(0);
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, log };
