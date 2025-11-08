/**
 * APIヘルパー関数
 * バックエンドAPIとの通信を簡略化する
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

/**
 * APIリクエストを送信する
 * @param {string} endpoint - APIエンドポイント（例: '/tasks/list'）
 * @param {Object} options - リクエストオプション
 * @param {string} options.method - HTTPメソッド
 * @param {Object} options.body - リクエストボディ
 * @param {string} options.token - 認証トークン
 * @returns {Promise<Object>} レスポンスJSON
 */
export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body = null, token = null } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
  }

  return await response.json();
}

/**
 * タスクを作成する（API経由）
 * @param {string} token - 認証トークン
 * @param {Object} taskData - タスクデータ
 * @returns {Promise<Object>} 作成されたタスク
 */
export async function createTask(token, taskData) {
  return await apiRequest('/tasks/create', {
    method: 'POST',
    body: taskData,
    token,
  });
}

/**
 * タスク一覧を取得する（API経由）
 * @param {string} token - 認証トークン
 * @param {Object} filters - フィルター条件
 * @returns {Promise<Object>} タスク一覧
 */
export async function getTasks(token, filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/tasks/list${queryParams ? `?${queryParams}` : ''}`;
  
  return await apiRequest(endpoint, { token });
}

/**
 * タスクを更新する（API経由）
 * @param {string} token - 認証トークン
 * @param {string} taskId - タスクID
 * @param {Object} updates - 更新データ
 * @returns {Promise<Object>} 更新されたタスク
 */
export async function updateTask(token, taskId, updates) {
  return await apiRequest('/tasks/update', {
    method: 'PUT',
    body: { id: taskId, ...updates },
    token,
  });
}

/**
 * タスクを削除する（API経由）
 * @param {string} token - 認証トークン
 * @param {string} taskId - タスクID
 * @returns {Promise<Object>} 削除結果
 */
export async function deleteTask(token, taskId) {
  return await apiRequest(`/tasks/delete?id=${taskId}`, {
    method: 'DELETE',
    token,
  });
}

/**
 * 日報を取得する（API経由）
 * @param {string} token - 認証トークン
 * @param {string} date - 日付（YYYY-MM-DD形式）
 * @returns {Promise<Object>} 日報データ
 */
export async function getDailyReport(token, date) {
  return await apiRequest(`/analytics/daily-report?date=${date}`, { token });
}
