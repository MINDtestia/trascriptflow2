import config from '@/config';
import store from '@/store';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = {};
    this.reconnectTimer = null;
  }

  connect() {
    if (this.socket && this.isConnected) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    this.socket = new WebSocket(`${config.WEBSOCKET.URL}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      store.commit('SET_WEBSOCKET_STATUS', 'connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this._handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      this.isConnected = false;
      store.commit('SET_WEBSOCKET_STATUS', 'disconnected');
      
      if (!event.wasClean) {
        this._attemptReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      store.commit('SET_WEBSOCKET_STATUS', 'error');
    };
  }

  _handleMessage(data) {
    // Handler par type de message
    switch (data.type) {
      case 'transcription_progress':
        store.commit('UPDATE_TRANSCRIPTION_PROGRESS', data.payload);
        break;
      case 'transcription_complete':
        store.commit('COMPLETE_TRANSCRIPTION', data.payload);
        break;
      case 'notification':
        store.commit('ADD_NOTIFICATION', data.payload);
        break;
      default:
        // Dispatch à tous les listeners pour ce type
        if (this.listeners[data.type]) {
          this.listeners[data.type].forEach(callback => callback(data.payload));
        }
    }
  }

  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    const delay = config.WEBSOCKET.RECONNECT_INTERVAL * this.reconnectAttempts;
    console.log(`Attempting to reconnect in ${delay}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  unsubscribe(type, callback) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
  }

  send(type, payload) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }

    try {
      this.socket.send(JSON.stringify({
        type,
        payload
      }));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export default new WebSocketService();