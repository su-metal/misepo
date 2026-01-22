import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, platform, presetId } = body;

    if (!content || !platform || !presetId) {
      return NextResponse.json({ error: 'Missing content, platform, or presetId' }, { status: 400 });
    }

    // Check if duplicate content already exists for this user AND preset
    const { data: existing } = await supabase
      .from('learning_sources')
      .select('id')
      .eq('user_id', user.id)
      .eq('preset_id', presetId)
      .eq('content', content)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already favorited', id: existing.id });
    }

    const { data, error } = await supabase
      .from('learning_sources')
      .insert({
        user_id: user.id,
        content,
        platform,
        preset_id: presetId
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, message: 'Saved to favorites' });
  } catch (error: any) {
    console.error('Error in POST learning source:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data } = await supabase
      .from('learning_sources')
      .select('content')
      .eq('user_id', user.id);

    return NextResponse.json({ 
      ok: true, 
      favorites: data?.map((d: any) => d.content) || [] 
    });
  } catch (error) {
    console.error('Error fetching learning sources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Attempt to get content from Body first (for long posts), fallback to searchParams
    let content: string | null = null;
    
    try {
      const body = await req.json();
      content = body.content;
    } catch {
      const { searchParams } = new URL(req.url);
      content = searchParams.get('content');
    }

    if (!content) {
       return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    const { error } = await supabase
      .from('learning_sources')
      .delete()
      .eq('user_id', user.id)
      .eq('content', content);

    if (error) throw error;

    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    try {
      const { searchParams } = new URL(req.url);
      const content = searchParams.get('content');
      if (content) {
        const { error: fallbackError } = await supabase
          .from('learning_sources')
          .delete()
          .eq('user_id', user.id)
          .eq('content', content);
        if (!fallbackError) return NextResponse.json({ message: 'Removed from favorites (fallback)' });
      }
    } catch {}

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
