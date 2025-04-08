"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Info, RefreshCw, AlertTriangle } from "lucide-react";

export default function TelegramDebugPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [testMessage, setTestMessage] = useState('Hello from Jolt Jordan!');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState(null);
  const [chatIdInput, setChatIdInput] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [currentEnvUrl, setCurrentEnvUrl] = useState('');
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  
  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch current environment URL
  const fetchCurrentEnvUrl = async () => {
    try {
      const response = await fetch('/api/config/url');
      const data = await response.json();
      setCurrentEnvUrl(data.appUrl);
    } catch (error) {
      console.error('Error fetching environment URL:', error);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/telegram/logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setMessage({ type: 'error', text: 'Failed to fetch logs' });
    } finally {
      setLoading(false);
    }
  };

  // Clear logs
  const clearLogs = async () => {
    try {
      const response = await fetch('/api/telegram/logs', {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setLogs([]);
        setMessage({ type: 'success', text: 'Logs cleared successfully' });
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      setMessage({ type: 'error', text: 'Failed to clear logs' });
    }
  };

  // Send test message
  const sendTestMessage = async () => {
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chatId: chatIdInput, 
          message: testMessage || `Test message from Jolt Jordan at ${new Date().toLocaleTimeString()}`
        })
      });
      
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          setError(errorData.error || 'Unknown error occurred');
        } else {
          const errorText = await response.text();
          setError(`Error ${response.status}: ${errorText.substring(0, 200)}...`);
        }
        return;
      }
      
      const data = await response.json();
      setResult(data);
      setMessage({ type: 'success', text: 'Message sent successfully!' });
    } catch (error) {
      setError(error.message);
    }
  };

  // Check webhook status
  const checkWebhook = async () => {
    try {
      const response = await fetch('/api/telegram/setup?action=status');
      const data = await response.json();
      
      if (data.ok && data.result) {
        setWebhookStatus(data.result);
      } else {
        setMessage({ type: 'error', text: 'Failed to get webhook status' });
      }
    } catch (error) {
      console.error('Error checking webhook:', error);
      setMessage({ type: 'error', text: 'Failed to check webhook status' });
    }
  };

  // Set webhook URL using the current .env URL
  const setCurrentWebhook = async () => {
    setIsSettingWebhook(true);
    setError(null);
    
    try {
      const response = await fetch('/api/telegram/setup?action=set');
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Webhook updated successfully!' });
        await checkWebhook();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to set webhook' });
      }
    } catch (error) {
      console.error('Error setting webhook:', error);
      setMessage({ type: 'error', text: 'Failed to set webhook' });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  // Set custom webhook URL
  const setCustomWebhook = async () => {
    if (!webhookUrl) {
      setMessage({ type: 'error', text: 'Please enter a webhook URL' });
      return;
    }

    setIsSettingWebhook(true);
    setError(null);
    
    try {
      const response = await fetch('/api/telegram/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: webhookUrl })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Custom webhook set successfully' });
        await checkWebhook();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to set webhook' });
      }
    } catch (error) {
      console.error('Error setting webhook:', error);
      setMessage({ type: 'error', text: 'Failed to set webhook' });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  // Delete webhook
  const deleteWebhook = async () => {
    setIsSettingWebhook(true);
    
    try {
      const response = await fetch('/api/telegram/setup?action=delete');
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Webhook deleted successfully' });
        setWebhookStatus(null);
        await checkWebhook();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete webhook' });
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
      setMessage({ type: 'error', text: 'Failed to delete webhook' });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLogs();
    checkWebhook();
    fetchCurrentEnvUrl();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Bot Debug Panel</h1>

      {message && (
        <Alert className={`mb-4 ${message.type === 'success' ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
            <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          </div>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="webhook">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Bot Activity Logs</CardTitle>
              <CardDescription>View recent activity from your Telegram bot</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading logs...</p>
              ) : logs.length === 0 ? (
                <p>No logs available</p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <Badge variant={log.type === 'info' ? 'default' : log.type === 'error' ? 'destructive' : 'outline'}>
                          {log.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm whitespace-pre-wrap">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchLogs} className="mr-2">Refresh</Button>
              <Button onClick={clearLogs} variant="outline">Clear Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Bot</CardTitle>
              <CardDescription>Send a test message through your Telegram bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chat ID</label>
                <Input
                  placeholder="Enter chat ID (e.g., 123456789)"
                  value={chatIdInput}
                  onChange={(e) => setChatIdInput(e.target.value)}
                />
                <p className="text-xs text-gray-500">This is the ID of the chat where you want to send the test message. Start a chat with your bot to get your ID.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {result && (
                <Alert className="bg-green-50 border-green-600">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>Message sent successfully</AlertTitle>
                  <AlertDescription>
                    Message ID: {result.response?.result?.message_id}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={sendTestMessage} disabled={!chatIdInput}>Send Test Message</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>View and update your bot's webhook settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Environment URL */}
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Current Environment URL</h3>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 p-1 rounded text-sm flex-1 break-all">{currentEnvUrl || 'Not available'}</code>
                  <Button size="sm" variant="outline" onClick={fetchCurrentEnvUrl}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This is the URL from your .env file (NEXT_PUBLIC_APP_URL). The webhook should use this URL.
                </p>
              </div>
              
              {/* Webhook Status */}
              <div>
                <h3 className="text-sm font-medium mb-2">Current Webhook Status</h3>
                {webhookStatus ? (
                  <div className="space-y-2 p-4 border rounded-md">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[120px]">URL:</span>
                      <code className="bg-gray-100 p-1 rounded text-sm break-all">{webhookStatus.url || 'Not set'}</code>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[120px]">Custom Certificate:</span>
                      <span>{webhookStatus.has_custom_certificate ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[120px]">Pending Updates:</span>
                      <span>{webhookStatus.pending_update_count}</span>
                    </div>
                    
                    {webhookStatus.last_error_date && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Last Error:</span>
                          <span>{new Date(webhookStatus.last_error_date * 1000).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-[120px]">Error Message:</span>
                          <span className="text-red-600">{webhookStatus.last_error_message}</span>
                        </div>
                      </>
                    )}
                    
                    {webhookStatus.url && currentEnvUrl && !webhookStatus.url.includes(currentEnvUrl) && (
                      <Alert className="mt-2 bg-yellow-50 border-yellow-600">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle>Webhook URL Mismatch</AlertTitle>
                        <AlertDescription>
                          Current webhook URL doesn't match your environment URL. Click "Update to Current URL" to fix this.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <p>Loading webhook status...</p>
                )}
              </div>
              
              {/* Webhook Actions */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={setCurrentWebhook} 
                    disabled={isSettingWebhook}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Update to Current URL
                  </Button>
                  
                  <Button 
                    onClick={checkWebhook} 
                    variant="outline"
                    disabled={isSettingWebhook}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                  
                  <Button 
                    onClick={deleteWebhook} 
                    variant="destructive"
                    disabled={isSettingWebhook || !webhookStatus?.url}
                  >
                    Delete Webhook
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-2">Set Custom Webhook</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://your-domain.com/api/telegram/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={setCustomWebhook} 
                      disabled={!webhookUrl || isSettingWebhook}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
