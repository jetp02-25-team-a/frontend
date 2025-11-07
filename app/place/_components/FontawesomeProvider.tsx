import { config } from '@fortawesome/fontawesome-svg-core';
import '@/app/place/lib/fontawesome';

config.autoAddCss = false;

export default function FontawesomeProvider() {
  return null; // 不渲染任何東西，只跑設定
}
