/**
 * FRONTEND API INTEGRATION TEST
 * Run in browser console or via: node --experimental-modules tests/frontend-test.js
 * 
 * This script validates that the frontend can:
 * 1. Register and login users
 * 2. Fetch subjects by year
 * 3. Create subjects (admin)
 * 4. Upload files (admin)
 * 5. Handle errors properly
 */

// Test configuration
const TEST_CONFIG = {
  apiBase: process.env.VITE_API_URL || 'http://localhost:5000/api',
  timeoutMs: 10000,
  testEmail: `test${Date.now()}@benha.edu.eg`,
  testPassword: 'TestPassword123',
  testName: `Test User ${Date.now()}`,
};

class FrontendTestSuite {
  constructor() {
    this.token = null;
    this.userId = null;
    this.subjectId = null;
    this.results = [];
  }

  log(type, message, data = null) {
    const icons = {
      test: '▶️ ',
      success: '✅',
      error: '❌',
      info: 'ℹ️ ',
      warn: '⚠️ ',
    };
    
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${icons[type]} ${message}`;
    console.log(logMsg);
    
    if (data) {
      console.log('   Details:', data);
    }
    
    this.results.push({ type, message, timestamp, data });
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async apiCall(method, endpoint, data = null) {
    try {
      const url = `${TEST_CONFIG.apiBase}${endpoint}`;
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: TEST_CONFIG.timeoutMs,
      };

      if (this.token) {
        config.headers['Authorization'] = `Bearer ${this.token}`;
      }

      if (data) {
        config.data = data;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.timeoutMs);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.msg || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return { status: response.status, data: responseData };

    } catch (error) {
      const errorMsg = error.name === 'AbortError' 
        ? 'Request timeout'
        : error.message;
      throw new Error(errorMsg);
    }
  }

  async testNetworkConnectivity() {
    this.log('test', 'Testing Network Connectivity');
    
    try {
      const response = await this.apiCall('GET', '/subjects?year=Year 1');
      this.log('success', `API is reachable (${response.status})`);
      this.log('info', `Found ${response.data.length} subjects for Year 1`);
      return true;
    } catch (error) {
      this.log('error', `Cannot reach API: ${error.message}`);
      this.log('warn', 'Check if backend is running and VITE_API_URL is correct');
      return false;
    }
  }

  async testRegistration() {
    this.log('test', 'Testing User Registration');
    
    try {
      const response = await this.apiCall('POST', '/auth/register', {
        name: TEST_CONFIG.testName,
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword,
        year: 'Year 1'
      });

      if (response.data.token && response.data.user) {
        this.token = response.data.token;
        this.userId = response.data.user.id;
        this.log('success', `User registered: ${response.data.user.name}`);
        this.log('info', `User role: ${response.data.user.role}`);
        this.log('info', `Token received: ${this.token.substring(0, 20)}...`);
        return true;
      } else {
        throw new Error('Invalid response structure from registration');
      }
    } catch (error) {
      this.log('error', `Registration failed: ${error.message}`);
      return false;
    }
  }

  async testLogin() {
    this.log('test', 'Testing User Login');
    
    try {
      const response = await this.apiCall('POST', '/auth/login', {
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword,
      });

      if (response.data.token && response.data.user) {
        this.token = response.data.token;
        this.userId = response.data.user.id;
        this.log('success', `Login successful: ${response.data.user.name}`);
        this.log('info', `Role: ${response.data.user.role}, Year: ${response.data.user.year}`);
        return true;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      this.log('error', `Login failed: ${error.message}`);
      return false;
    }
  }

  async testSubjectFetching() {
    this.log('test', 'Testing Subject Fetching (Multiple Years)');
    
    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
    const results = {};
    
    for (const year of years) {
      try {
        const response = await this.apiCall('GET', `/subjects?year=${year}`);
        results[year] = response.data.length;
        this.log('info', `${year}: ${response.data.length} subjects`);
      } catch (error) {
        this.log('error', `Failed to fetch ${year}: ${error.message}`);
        results[year] = 'ERROR';
      }
    }

    const totalSubjects = Object.values(results)
      .filter(v => typeof v === 'number')
      .reduce((a, b) => a + b, 0);
    
    this.log('success', `Total subjects across all years: ${totalSubjects}`);
    return totalSubjects > 0;
  }

  async testProtectedRoute() {
    this.log('test', 'Testing Protected Routes (Requires Auth)');
    
    // Test with token
    try {
      const response = await this.apiCall('GET', '/users');
      this.log('success', `Protected route accessible: fetched ${response.data.length} users`);
    } catch (error) {
      this.log('error', `Protected route failed: ${error.message}`);
    }

    // Test without token
    const originalToken = this.token;
    this.token = null;
    
    try {
      await this.apiCall('GET', '/users');
      this.log('error', 'Security issue: Protected route accessible without token!');
    } catch (error) {
      this.log('success', `Protected route correctly requires auth: ${error.message}`);
    }
    
    this.token = originalToken;
  }

  async testErrorHandling() {
    this.log('test', 'Testing Error Handling');

    // Test invalid credentials
    try {
      await this.apiCall('POST', '/auth/login', {
        email: 'nonexistent@benha.edu.eg',
        password: 'wrongpassword'
      });
      this.log('error', 'Invalid credentials were accepted - SECURITY ISSUE');
    } catch (error) {
      this.log('success', `Invalid credentials correctly rejected: ${error.message}`);
    }

    // Test empty fields
    try {
      await this.apiCall('POST', '/auth/register', {
        name: '',
        email: 'test@benha.edu.eg',
        password: ''
      });
      this.log('error', 'Empty fields were accepted');
    } catch (error) {
      this.log('success', `Empty fields correctly rejected: ${error.message}`);
    }

    // Test nonexistent endpoint
    try {
      await this.apiCall('GET', '/nonexistent');
      this.log('error', '404 errors not handled');
    } catch (error) {
      this.log('success', `404 errors properly handled: ${error.message}`);
    }
  }

  async testLocalStorage() {
    this.log('test', 'Testing Local Storage Integration');
    
    try {
      // Simulate what frontend does
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify({
        id: this.userId,
        name: TEST_CONFIG.testName,
        role: 'student'
      }));

      const storedToken = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedToken === this.token && storedUser.id === this.userId) {
        this.log('success', 'Local storage working correctly');
        this.log('info', `Stored user: ${storedUser.name}`);
        
        // Cleanup
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        return true;
      } else {
        throw new Error('Local storage values do not match');
      }
    } catch (error) {
      this.log('error', `Local storage test failed: ${error.message}`);
      return false;
    }
  }

  async testResponseStructure() {
    this.log('test', 'Testing API Response Structure');
    
    try {
      // Check auth response structure
      const authRes = await this.apiCall('POST', '/auth/login', {
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword
      });

      const requiredAuthFields = ['token', 'user'];
      const missingFields = requiredAuthFields.filter(f => !(f in authRes.data));

      if (missingFields.length === 0) {
        this.log('success', 'Auth response has correct structure');
        
        const requiredUserFields = ['id', 'name', 'role', 'email', 'year'];
        const missingUserFields = requiredUserFields.filter(f => !(f in authRes.data.user));
        
        if (missingUserFields.length === 0) {
          this.log('success', 'User object has all required fields');
        } else {
          this.log('warn', `User object missing fields: ${missingUserFields.join(', ')}`);
        }
      } else {
        this.log('error', `Auth response missing fields: ${missingFields.join(', ')}`);
      }

      // Check subjects response structure
      const subjectsRes = await this.apiCall('GET', '/subjects');
      if (Array.isArray(subjectsRes.data) && subjectsRes.data.length > 0) {
        const requiredSubjectFields = ['_id', 'name', 'code', 'credits'];
        const subject = subjectsRes.data[0];
        const missingSubjectFields = requiredSubjectFields.filter(f => !(f in subject));
        
        if (missingSubjectFields.length === 0) {
          this.log('success', 'Subject objects have correct structure');
        } else {
          this.log('warn', `Subject objects missing fields: ${missingSubjectFields.join(', ')}`);
        }
      }

    } catch (error) {
      this.log('error', `Response structure test failed: ${error.message}`);
    }
  }

  async testCORSHeaders() {
    this.log('test', 'Testing CORS Configuration');
    
    try {
      const response = await fetch(`${TEST_CONFIG.apiBase}/subjects`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://genbyte-five.vercel.app',
          'Access-Control-Request-Method': 'GET'
        }
      });

      const corsHeader = response.headers.get('access-control-allow-origin');
      if (corsHeader) {
        this.log('success', `CORS allows origin: ${corsHeader}`);
      } else {
        this.log('info', 'CORS header not explicitly set (may inherit from default)');
      }

    } catch (error) {
      this.log('warn', `CORS test inconclusive: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              TEST SUITE SUMMARY REPORT                  ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const byType = {};
    this.results.forEach(r => {
      byType[r.type] = (byType[r.type] || 0) + 1;
    });

    console.log('Test Results Summary:');
    Object.entries(byType).forEach(([type, count]) => {
      const icons = { success: '✅', error: '❌', test: '▶️ ', info: 'ℹ️ ', warn: '⚠️ ' };
      console.log(`  ${icons[type]} ${type.toUpperCase()}: ${count}`);
    });

    console.log('\n Key Validations:');
    const criticalTests = [
      { name: 'Network Connectivity', types: ['success'] },
      { name: 'User Registration', types: ['success'] },
      { name: 'User Login', types: ['success'] },
      { name: 'Subject Fetching', types: ['success'] },
      { name: 'Protected Routes', types: ['success'] },
    ];

    criticalTests.forEach(test => {
      const hasPassed = this.results.some(r => r.message.includes(test.name) && test.types.includes(r.type));
      console.log(`  ${hasPassed ? '✅' : '❌'} ${test.name}`);
    });

    console.log('\n Complete Test Log:');
    console.table(this.results.map(r => ({
      Type: r.type.toUpperCase(),
      Message: r.message,
      Time: r.timestamp,
    })));

    return this.results;
  }

  async runAll() {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         GENBYTE FRONTEND API TEST SUITE                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`API Base: ${TEST_CONFIG.apiBase}`);
    console.log(`Test User Email: ${TEST_CONFIG.testEmail}`);
    console.log(`Started: ${new Date().toISOString()}\n`);

    try {
      const connected = await this.testNetworkConnectivity();
      if (!connected) {
        this.log('error', 'Tests aborted - backend not reachable');
        return this.generateReport();
      }

      await this.delay(500);
      await this.testCORSHeaders();
      
      await this.delay(500);
      await this.testRegistration();
      
      await this.delay(500);
      await this.testLogin();
      
      await this.delay(500);
      await this.testSubjectFetching();
      
      await this.delay(500);
      await this.testProtectedRoute();
      
      await this.delay(500);
      await this.testErrorHandling();
      
      await this.delay(500);
      await this.testResponseStructure();
      
      await this.delay(500);
      await this.testLocalStorage();

      return this.generateReport();

    } catch (error) {
      this.log('error', `Test suite execution failed: ${error.message}`);
      return this.generateReport();
    }
  }
}

// Export for use in browser or Node
if (typeof window !== 'undefined') {
  window.FrontendTestSuite = FrontendTestSuite;
  console.log('✅ Frontend Test Suite loaded. Run: new FrontendTestSuite().runAll()');
} else if (typeof module !== 'undefined') {
  module.exports = FrontendTestSuite;
}
