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

export default function TelegramDebugPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState(null);

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
    if (!testMessage) {
      setMessage({ type: 'error', text: 'Please enter a message' });
      return;
    }

    try {
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: testMessage })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Message sent successfully' });
        setTestMessage('');
        fetchLogs();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      setMessage({ type: 'error', text: 'Failed to send message' });
    }
  };

  // Check webhook status
  const checkWebhook = async () => {
    try {
      // Change this line to use the setup endpoint with the status action
      const response = await fetch('/api/telegram/setup?action=status');
      const data = await response.json();
      
      // The webhook info is nested in the response
      setWebhookStatus(data.webhook_info || data);
    } catch (error) {
      console.error('Error checking webhook:', error);
      setMessage({ type: 'error', text: 'Failed to check webhook status' });
    }
  };

  // Set webhook URL
  const setWebhook = async () => {
    if (!webhookUrl) {
      setMessage({ type: 'error', text: 'Please enter a webhook URL' });
      return;
    }

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
        setMessage({ type: 'success', text: 'Webhook set successfully' });
        checkWebhook();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to set webhook' });
      }
    } catch (error) {
      console.error('Error setting webhook:', error);
      setMessage({ type: 'error', text: 'Failed to set webhook' });
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLogs();
    checkWebhook();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Bot Debug Panel</h1>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <Tabs defaultValue="logs">
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
            <CardContent>
              <Textarea
                placeholder="Enter your message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={sendTestMessage}>Send Test Message</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>View and update your bot's webhook settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Current Webhook Status</h3>
                {webhookStatus ? (
                  <div>
                    <p><strong>URL:</strong> {webhookStatus.url || 'Not set'}</p>
                    <p><strong>Has Custom Certificate:</strong> {webhookStatus.has_custom_certificate ? 'Yes' : 'No'}</p>
                    <p><strong>Pending Update Count:</strong> {webhookStatus.pending_update_count}</p>
                    <p><strong>Last Error Date:</strong> {webhookStatus.last_error_date ? new Date(webhookStatus.last_error_date * 1000).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Error Message:</strong> {webhookStatus.last_error_message || 'None'}</p>
                  </div>
                ) : (
                  <p>Loading webhook status...</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Set New Webhook</h3>
                <Input
                  placeholder="https://your-domain.com/api/telegram/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="mb-2"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={checkWebhook} variant="outline">Refresh Status</Button>
              <Button onClick={setWebhook}>Set Webhook</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
