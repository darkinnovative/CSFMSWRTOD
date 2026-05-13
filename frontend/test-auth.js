// Test script to check API authorization
const API_URL = 'http://localhost:8000';

async function testSiteAPI() {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  
  try {
    const response = await fetch(`${API_URL}/api/sites/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Sites data:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Test site creation
async function testSiteCreation() {
  const token = localStorage.getItem('token');
  console.log('Creating site with token:', token);
  
  const siteData = {
    site_name: "Test Site",
    site_order: 0,
    latitude: 0.0,
    longitude: 0.0,
    status: "active",
    start_date: "2024-01-01T00:00:00",
    expected_end_date: "2024-12-31T00:00:00",
    manager_name: "Test Manager",
    manager_phone: "1234567890"
  };
  
  try {
    const response = await fetch(`${API_URL}/api/sites/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });
    
    console.log('Create site response status:', response.status);
    console.log('Create site response:', await response.json());
  } catch (error) {
    console.error('Create site error:', error);
  }
}

// Run tests
testSiteAPI();
testSiteCreation();
