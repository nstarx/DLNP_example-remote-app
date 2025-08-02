// In production (when served by nginx), use relative URLs
// In development, use the full URL to the Node.js server
// If VITE_API_URL is explicitly set (even as empty string), use it
// Otherwise, use default based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.PROD ? '' : 'http://localhost:3001');

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Stats endpoints
  async getStats() {
    return this.request('/api/stats');
  }

  // Items endpoints
  async getItems() {
    return this.request('/api/items');
  }

  async getItem(id) {
    return this.request(`/api/items/${id}`);
  }

  async createItem(item) {
    return this.request('/api/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(id, item) {
    return this.request(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id) {
    return this.request(`/api/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard specific endpoints
  async getSalesTrend() {
    return this.request('/api/sales-trend');
  }

  async getRecentActivity() {
    return this.request('/api/recent-activity');
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Documentation endpoints
  async getDocs() {
    return this.request('/api/docs');
  }

  async getDocContent(docName) {
    return this.request(`/api/docs/${docName}`);
  }
}

export default new ApiService();