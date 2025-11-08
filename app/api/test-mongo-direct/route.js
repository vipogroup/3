import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return NextResponse.json({
      success: false,
      error: "MONGODB_URI not set"
    });
  }
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    await client.db().admin().ping();
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: "✅ MongoDB Connected!",
      uriLength: uri.length,
      uriStart: uri.substring(0, 40) + '...'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorName: error.name,
      uriLength: uri.length,
      uriStart: uri.substring(0, 40) + '...'
    });
  }
}
