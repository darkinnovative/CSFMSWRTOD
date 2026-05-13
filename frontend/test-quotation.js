// Test script to check quotation creation API
const API_URL = 'http://localhost:8000';

async function testQuotationCreation() {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  
  const quotationData = {
    project_name: "Test Project",
    state: "Maharashtra",
    city: "Mumbai",
    pincode: "400001",
    landmark: "Test Landmark",
    client_name: "Test Client",
    client_email: "test@example.com",
    entry_gates: 2,
    required_cameras: 4,
    land_area: 1000.5,
    duration_days: 30,
    budget_amount: 50000.0,
    project_type: "Construction",
    has_promotional_clips: false,
    project_design_file: null,
    company_id: 1, // This might be missing
    valid_until: "2024-12-31T23:59:59Z"
  };
  
  console.log('Sending quotation data:', JSON.stringify(quotationData, null, 2));
  
  try {
    const response = await fetch(`${API_URL}/api/quotations/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quotationData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('Quotation created:', data);
    } else {
      console.log('Error response:', responseText);
    }
  } catch (error) {
    console.error('Quotation creation error:', error);
  }
}

// Test the API
testQuotationCreation();
