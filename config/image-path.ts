export const IMAGE_PATH = `http://localhost:3005/images/`;
export const AVATAR_PATH = `http://localhost:3005/images/avatars/`;
export const ARTICLE_PHOTOS_PATH = `http://localhost:3005/images/posts/`;

// places 圖片路徑
const API_BASE = 'http://localhost:3005';
export function buildImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}
