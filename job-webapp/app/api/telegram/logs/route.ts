import { NextResponse } from 'next/server';

// Store logs in memory (will be cleared on server restart)
const logEntries: {timestamp: string; type: string; message: string}[] = [];

// Add a log entry
export function addLog(type: 'info' | 'error' | 'warn', message: string) {
  const timestamp = new Date().toISOString();
  logEntries.push({ timestamp, type, message });
  
  // Keep only the last 100 logs
  if (logEntries.length > 100) {
    logEntries.shift();
  }
  
  // Log to console as well
  console[type](`[TELEGRAM LOG] ${message}`);
}

// API route to get logs
export async function GET() {
  return NextResponse.json({
    logs: logEntries
  });
}

// API route to clear logs
export async function DELETE() {
  logEntries.length = 0;
  return NextResponse.json({
    success: true,
    message: "Logs cleared"
  });
}
