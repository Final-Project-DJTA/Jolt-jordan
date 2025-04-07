"use client";

import { useState, useEffect } from 'react';

export default function TelegramDebugPage() {
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [action, setAction] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  async function fetchWebhookInfo() {
    setLoading(true);
    try {
      const response = await fetch('/api/telegram/setup');
      const data = await response.json();
      setWebhookInfo(data);
      setMessage('Webhook info retrieved successfully');
    } catch (error) {
      console.error('Error fetching webhook info:', error);
      setMessage('Error fetching webhook info: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogs() {
    try {
      const response = await fetch('/api/telegram/logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }

  async function clearLogs() {
    try {
      await fetch('/api/telegram/logs', { method: 'DELETE' });
      setLogs([]);
      setMessage('Logs cleared');
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  }

  async function fetchUpdates() {
    setLoading(true);
    try {
      const response = await fetch('/api/telegram/setup?action=getUpdates');
      const data = await response.json();
      setUpdates(data.updates || []);
      setMessage('Updates fetched successfully');
    } catch (error) {
      console.error('Error fetching updates:', error);
      setMessage('Error fetching updates: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(actionType: string) {
    setLoading(true);
    setAction(actionType);
    
    try {
      let url = `/api/telegram/setup?action=${actionType}`;
      if (actionType === 'test' && chatId) {
        url += `&chat_id=${chatId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (actionType === 'test') {
        setTestResult(data);
      } else {
        setWebhookInfo(data);
      }
      
      setMessage(`${actionType} action completed successfully`);
    } catch (error) {
      console.error(`Error with ${actionType} action:`, error);
      setMessage(`Error with ${actionType} action: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWebhookInfo();
    
    // Poll for logs every 5 seconds
    const logInterval = setInterval(fetchLogs, 5000);
    
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Bot Debug Panel</h1>
      
      {message && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Webhook Management</h2>
          <div className="space-y-4">
            <button 
              onClick={() => handleAction('set')} 
              disabled={loading && action === 'set'}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {loading && action === 'set' ? 'Setting...' : 'Set Webhook'}
            </button>
            
            <button 
              onClick={() => handleAction('remove')} 
              disabled={loading && action === 'remove'}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {loading && action === 'remove' ? 'Removing...' : 'Remove Webhook'}
            </button>
            
            <button 
              onClick={fetchWebhookInfo} 
              disabled={loading && !action}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {loading && !action ? 'Refreshing...' : 'Refresh Info'}
            </button>
            
            <button
              onClick={fetchUpdates}
              disabled={loading && action === 'getUpdates'}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              {loading && action === 'getUpdates' ? 'Fetching...' : 'Get Updates'}
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Current Webhook Info:</h3>
            {loading && !action ? (
              <p>Loading...</p>
            ) : webhookInfo ? (
              <pre className="bg-gray-100 p-4 overflow-x-auto rounded text-sm">
                {JSON.stringify(webhookInfo, null, 2)}
              </pre>
            ) : (
              <p>No information available</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Chat ID:</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter Telegram Chat ID"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your chat ID from test: {webhookInfo?.webhook_info?.pending_update_count > 0 ? "Please click 'Get Updates' to find your chat ID" : ""}
              </p>
            </div>
            
            <button
              onClick={() => handleAction('test')}
              disabled={!chatId || (loading && action === 'test')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              {loading && action === 'test' ? 'Sending...' : 'Send Test Message'}
            </button>
            
            {testResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <pre className="bg-gray-100 p-4 overflow-x-auto rounded text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Updates */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
        {updates.length > 0 ? (
          <pre className="bg-gray-100 p-4 overflow-x-auto rounded text-sm">
            {JSON.stringify(updates, null, 2)}
          </pre>
        ) : (
          <p>No recent updates. Click "Get Updates" to fetch them.</p>
        )}
      </div>
      
      {/* Debugging Instructions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Debugging Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Make sure your <code>TELEGRAM_BOT_TOKEN</code> is correctly set in your <code>.env</code> file (without any extra spaces).</li>
          <li>Use the &quot;Set Webhook&quot; button to register your webhook URL with Telegram.</li>
          <li>Check the &quot;Current Webhook Info&quot; to ensure your webhook is set up correctly.</li>
          <li>If you're using ngrok, make sure your NEXT_PUBLIC_APP_URL is updated in your .env file whenever your ngrok URL changes.</li>
          <li>Enter your Telegram chat ID and click &quot;Send Test Message&quot; to verify the bot can send messages.</li>
        </ol>
      </div>
    </div>
  );
}
