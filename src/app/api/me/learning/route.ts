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

    // In-place update if replaceId provided
    if (replaceId) {
      const { error: updateError } = await supabase
        .from('learning_sources')
        .update({
          content: content.trim(),
          platform,
          preset_id: presetId,
          source
        })
        .eq('user_id', user.id)
        .eq('id', replaceId);

      if (updateError) throw updateError;
      return NextResponse.json({ ok: true, id: replaceId, message: 'Updated training data' });
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
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    
    const id = body.id || searchParams.get('id');
    const content = body.content || searchParams.get('content');
    const presetId = body.presetId || searchParams.get('presetId');
    const platform = body.platform || searchParams.get('platform');

    if (!content && !id && !presetId) {
      return NextResponse.json({ error: 'Missing content, id, or presetId' }, { status: 400 });
    }

    const query = supabase
      .from('learning_sources')
      .delete()
      .eq('user_id', user.id);
    
    if (id) {
      query.eq('id', id);
    } else {
      if (presetId) query.eq('preset_id', presetId);
      if (content) query.eq('content', content);
      
      if (platform) {
        if (platform === 'sns_all') {
          query.neq('platform', 'Google Maps');
        } else {
          query.eq('platform', platform);
        }
      }
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, message: 'Removed' });
  } catch (error: any) {
    console.error('Error removing learning source:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
