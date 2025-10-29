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
//減去時間 沒有秒
export function reduceTimeWrap(baseTime: string, addTime: string) {
  const [h1, m1] = baseTime.split(':').map(Number);
  const [h2, m2] = addTime.split(':').map(Number);
  let totalSeconds = h1 * 3600 + m1 * 60 - (h2 * 3600 + m2 * 60);

  // 取 24 小時內的餘數
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return [hours, minutes].map((v) => String(v).padStart(2, '0')).join(':');
}

//YYYY-MM-DD to MM月DD日
export function formatDateToChinese(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // JS 月份從 0 開始
  const day = date.getDate();
  return `${month}月${day}日`;
}

// 轉換成時間小時到分
export function getTimeCost(time?: string) {
  if (!time) return;
  const [sh, sm] = time.split(':').map(Number);

  const timeMinutes = sh * 60 + sm;

  const hours = Math.floor(timeMinutes / 60);
  const minutes = timeMinutes % 60;

  return `${hours}小時${minutes}分`;
}

//處理時間至小時到分加上PMAM
export function formatTime12Hour(time: string): string {
  // time 格式: "HH:MM:SS"
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12; // 12 AM 或 12 PM

  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}
