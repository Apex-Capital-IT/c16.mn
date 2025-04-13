const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getArticleById(category: string, id: string) {
  try {
    const response = await fetch(`${API_URL}/api/news?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    const data = await response.json();
    const index = parseInt(id) - 1;
    return data[index] || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
} 