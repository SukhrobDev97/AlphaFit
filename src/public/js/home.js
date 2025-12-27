/**
 * Home Page - Stats Fetching and Display (for admin)
 */

// API endpoint
const STATS_API_URL = '/admin/api/stats';

/**
 * Format number with US Dollar currency
 */
function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}

/**
 * Format number with locale
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Show loading state
 */
function showLoading() {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const kpiCardsContainer = document.getElementById('kpiCardsContainer');
  
  if (loadingState) loadingState.style.display = 'flex';
  if (errorState) errorState.style.display = 'none';
  if (kpiCardsContainer) kpiCardsContainer.style.display = 'none';
}

/**
 * Show error state
 */
function showError() {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const kpiCardsContainer = document.getElementById('kpiCardsContainer');
  
  if (loadingState) loadingState.style.display = 'none';
  if (errorState) errorState.style.display = 'block';
  if (kpiCardsContainer) kpiCardsContainer.style.display = 'none';
}

/**
 * Show KPI cards with data
 */
function showKPICards(stats) {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const kpiCardsContainer = document.getElementById('kpiCardsContainer');
  
  if (loadingState) loadingState.style.display = 'none';
  if (errorState) errorState.style.display = 'none';
  if (kpiCardsContainer) kpiCardsContainer.style.display = 'grid';

  // Update Today's Revenue
  const todayRevenueEl = document.getElementById('todayRevenue');
  if (todayRevenueEl) {
    todayRevenueEl.textContent = formatCurrency(stats.todayRevenue);
  }

  // Update Today's Orders
  const todayOrdersEl = document.getElementById('todayOrders');
  if (todayOrdersEl) {
    todayOrdersEl.textContent = `${formatNumber(stats.todayOrders)} orders`;
  }

  // Update Active Products
  const activeProductsEl = document.getElementById('activeProducts');
  if (activeProductsEl) {
    activeProductsEl.textContent = formatNumber(stats.activeProducts);
  }

  // Update Active Users
  const activeUsersEl = document.getElementById('activeUsers');
  if (activeUsersEl) {
    activeUsersEl.textContent = formatNumber(stats.activeUsers);
  }
}

/**
 * Fetch stats from API
 */
async function loadStats() {
  try {
    showLoading();

    const response = await axios.get(STATS_API_URL);

    if (response.status === 200 && response.data) {
      const stats = response.data;
      
      // Validate stats data
      if (
        typeof stats.todayRevenue === 'number' &&
        typeof stats.todayOrders === 'number' &&
        typeof stats.activeProducts === 'number' &&
        typeof stats.activeUsers === 'number'
      ) {
        showKPICards(stats);
      } else {
        console.error('Invalid stats data format:', stats);
        showError();
      }
    } else {
      console.error('Invalid response:', response);
      showError();
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    // Check if it's an authentication error (HTML response)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<script>')) {
      console.error('Authentication failed - redirecting to login');
      window.location.replace('/admin/login');
      return;
    }
    
    showError();
  }
}

// Load stats when page loads (only if admin elements exist)
document.addEventListener('DOMContentLoaded', function() {
  // Only load stats if we're on the admin page (KPI grid exists)
  if (document.getElementById('kpiGrid')) {
    loadStats();
  }
});

// Make loadStats available globally for retry button
window.loadStats = loadStats;
