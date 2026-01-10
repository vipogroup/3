import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import BotConfig from '@/models/BotConfig';

// GET - Fetch bot config based on owner type
export async function GET(request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const ownerType = searchParams.get('ownerType') || 'admin';
    const businessId = searchParams.get('businessId') || null;
    
    let query = { ownerType };
    if (ownerType === 'business' && businessId) {
      query.businessId = businessId;
    } else if (ownerType === 'admin') {
      query.businessId = null;
    }
    
    let config = await BotConfig.findOne(query);
    
    // If no config exists, create default
    if (!config) {
      config = new BotConfig({
        ownerType,
        businessId: ownerType === 'business' ? businessId : null,
        categories: BotConfig.getDefaultCategories()
      });
      await config.save();
    }
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching bot config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update bot config
export async function PUT(request) {
  try {
    await connectMongo();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { ownerType, businessId, texts, buttons, placeholders, categories, settings } = body;
    
    let query = { ownerType };
    if (ownerType === 'business' && businessId) {
      query.businessId = businessId;
    } else if (ownerType === 'admin') {
      query.businessId = null;
    }
    
    const updateData = {};
    if (texts) updateData.texts = texts;
    if (buttons) updateData.buttons = buttons;
    if (placeholders) updateData.placeholders = placeholders;
    if (categories) updateData.categories = categories;
    if (settings) updateData.settings = settings;
    
    const config = await BotConfig.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error updating bot config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add category or question
export async function POST(request) {
  try {
    await connectMongo();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { ownerType, businessId, action, categoryId, data } = body;
    
    let query = { ownerType };
    if (ownerType === 'business' && businessId) {
      query.businessId = businessId;
    } else if (ownerType === 'admin') {
      query.businessId = null;
    }
    
    let config = await BotConfig.findOne(query);
    
    if (!config) {
      config = new BotConfig({
        ownerType,
        businessId: ownerType === 'business' ? businessId : null,
        categories: BotConfig.getDefaultCategories()
      });
    }
    
    if (action === 'addCategory') {
      const newCategory = {
        id: `cat_${Date.now()}`,
        name: data.name || 'קטגוריה חדשה',
        isContact: data.isContact || false,
        order: config.categories.length + 1,
        isActive: true,
        questions: []
      };
      config.categories.push(newCategory);
    } 
    else if (action === 'addQuestion' && categoryId) {
      const category = config.categories.find(c => c.id === categoryId);
      if (category) {
        const newQuestion = {
          id: `q_${Date.now()}`,
          question: data.question || 'שאלה חדשה',
          answer: data.answer || 'תשובה חדשה',
          order: category.questions.length + 1,
          isActive: true
        };
        category.questions.push(newQuestion);
      }
    }
    
    await config.save();
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error adding to bot config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove category or question
export async function DELETE(request) {
  try {
    await connectMongo();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const ownerType = searchParams.get('ownerType') || 'admin';
    const businessId = searchParams.get('businessId') || null;
    const action = searchParams.get('action');
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');
    
    let query = { ownerType };
    if (ownerType === 'business' && businessId) {
      query.businessId = businessId;
    } else if (ownerType === 'admin') {
      query.businessId = null;
    }
    
    const config = await BotConfig.findOne(query);
    
    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }
    
    if (action === 'deleteCategory' && categoryId) {
      config.categories = config.categories.filter(c => c.id !== categoryId);
    } 
    else if (action === 'deleteQuestion' && categoryId && questionId) {
      const category = config.categories.find(c => c.id === categoryId);
      if (category) {
        category.questions = category.questions.filter(q => q.id !== questionId);
      }
    }
    
    await config.save();
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error deleting from bot config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
