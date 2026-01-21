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
    console.error('Error saving favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const content = searchParams.get('content');

    if (!content) {
       return NextResponse.json({ error: 'Missing content param' }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
