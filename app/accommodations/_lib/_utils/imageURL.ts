import { IMAGE_PATH } from '@/config/image-path';

export function buildImageUrl(path: string) {
  return `${IMAGE_PATH}${path}`;
}
