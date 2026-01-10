import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    console.log('Resetting WhatsApp server...');
    
    // Try to restart the WhatsApp server using PM2
    try {
      await execAsync('pm2 restart whatsapp-server');
      console.log('WhatsApp server restarted successfully');
      
      // Wait a bit for the server to restart
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return NextResponse.json({ 
        success: true, 
        message: 'WhatsApp server restarted successfully' 
      });
    } catch (pm2Error) {
      console.error('PM2 restart failed:', pm2Error);
      
      // If PM2 fails, try to restart the process directly
      try {
        // Stop the server
        await execAsync('pm2 stop whatsapp-server');
        
        // Clear the auth session
        await execAsync('rmdir /s /q whatsapp-server\\.wwebjs_auth');
        
        // Start the server again
        await execAsync('pm2 start whatsapp-server');
        
        return NextResponse.json({ 
          success: true, 
          message: 'WhatsApp server reset completely' 
        });
      } catch (resetError) {
        console.error('Complete reset failed:', resetError);
        throw resetError;
      }
    }
  } catch (error) {
    console.error('Error resetting WhatsApp server:', error);
    return NextResponse.json({ 
      error: 'Failed to reset WhatsApp server',
      details: error.message 
    }, { status: 500 });
  }
}

// GET endpoint to check if reset is available
export async function GET(request) {
  try {
    // Check if PM2 is available
    const { stdout } = await execAsync('pm2 list');
    const hasWhatsAppServer = stdout.includes('whatsapp-server');
    
    return NextResponse.json({ 
      available: hasWhatsAppServer,
      message: hasWhatsAppServer 
        ? 'Reset function available' 
        : 'WhatsApp server not found in PM2'
    });
  } catch (error) {
    return NextResponse.json({ 
      available: false,
      error: 'PM2 not available or not configured' 
    });
  }
}
