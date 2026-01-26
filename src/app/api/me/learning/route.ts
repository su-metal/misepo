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
    const { content, platform, presetId, replaceId, source = 'manual' } = body;

    if (!content || !platform || !presetId) {
      return NextResponse.json({ error: 'Missing content, platform, or presetId' }, { status: 400 });
    }

    // Check for duplicate content for this user AND preset
    // Skip this check if we are doing a replacement (update), as we want to allow updating the platform of an existing text.
    if (!replaceId) {
      const { data: existing } = await supabase
        .from('learning_sources')
        .select('id')
        .eq('user_id', user.id)
        .eq('preset_id', presetId)
        .eq('content', content.trim())
        .single();

      if (existing) {
        return NextResponse.json({ ok: true, message: 'Already exists', id: existing.id });
      }
    }

    // Check count for this preset (Omakase vs Custom etc)
    const { data: currentItems } = await supabase
      .from('learning_sources')
      .select('id, content, platform, preset_id, created_at, source')
      .eq('user_id', user.id)
      .eq('preset_id', presetId)
      .order('created_at', { ascending: true });

    if (!replaceId && (currentItems?.length || 0) >= 50) {
      return NextResponse.json({ 
        ok: false, 
        error: 'LIMIT_REACHED', 
        message: '学習データは1つのプロフィールにつき50件までです。',
        currentItems: currentItems?.map(item => ({
          id: item.id,
          content: item.content,
          platform: item.platform,
          presetId: item.preset_id,
          createdAt: item.created_at,
          source: item.source
        }))
      }, { status: 409 });
    }

    // Atomic replacement if replaceId provided
    if (replaceId) {
      await supabase
        .from('learning_sources')
        .delete()
        .eq('user_id', user.id)
        .eq('id', replaceId);
    }

    const { data, error } = await supabase
      .from('learning_sources')
      .insert({
        user_id: user.id,
        content: content.trim(),
        platform,
        preset_id: presetId,
        source
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, id: data.id, message: 'Saved to training data' });
  } catch (error: any) {
    console.error('Error in POST learning source:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
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
      .select('id, content, platform, preset_id, created_at')
      .eq('user_id', user.id);

    const items = (data || []).map((d: any) => ({
      id: d.id,
      content: d.content,
      platform: d.platform,
      presetId: d.preset_id,
      createdAt: d.created_at
    }));

    return NextResponse.json({ 
      ok: true, 
      items
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
    let content: string | null = null;
    let id: string|null = null;
    
    try {
      const body = await req.json();
      content = body.content;
      id = body.id;
    } catch {
      const { searchParams } = new URL(req.url);
      content = searchParams.get('content');
      id = searchParams.get('id');
    }

    if (!content && !id) {
       return NextResponse.json({ error: 'Missing content or id' }, { status: 400 });
    }

    const query = supabase
      .from('learning_sources')
      .delete()
      .eq('user_id', user.id);
    
    if (id) query.eq('id', id);
    else query.eq('content', content);

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, message: 'Removed' });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
