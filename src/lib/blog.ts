import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  category?: string;
  image?: string;
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const date = matterResult.data.date instanceof Date 
        ? matterResult.data.date.toISOString().split('T')[0] 
        : String(matterResult.data.date || '');

      return {
        slug,
        title: matterResult.data.title,
        date,
        description: matterResult.data.description,
        content: matterResult.content,
        category: matterResult.data.category || 'その他',
        image: matterResult.data.image,
      } as PostData;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const date = matterResult.data.date instanceof Date 
      ? matterResult.data.date.toISOString().split('T')[0] 
      : String(matterResult.data.date || '');

    return {
      slug,
      title: matterResult.data.title,
      date,
      description: matterResult.data.description,
      content: matterResult.content,
      category: matterResult.data.category || 'その他',
      image: matterResult.data.image,
    } as PostData;
  } catch (error) {
    return null;
  }
}
