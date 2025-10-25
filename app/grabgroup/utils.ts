export function numberToChinese(num: number) {
  const ch = ['一', '二', '三', '四', '五', '六', '七'];
  if (num < 1 || num > 7) throw new Error('只接受 1~7 的數字');
  return ch[num - 1];
}

export function addTimeWrap(baseTime: string, addTime: string) {
  const [h1, m1, s1] = baseTime.split(':').map(Number);
  const [h2, m2, s2] = addTime.split(':').map(Number);
  let totalSeconds = h1 * 3600 + m1 * 60 + s1 + (h2 * 3600 + m2 * 60 + s2);

  // 取 24 小時內的餘數
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
}
//YYYY-MM-DD to MM月DD日
export function formatDateToChinese(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // JS 月份從 0 開始
  const day = date.getDate();
  return `${month}月${day}日`;
}
