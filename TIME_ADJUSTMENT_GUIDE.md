# ⏰ 節點時間調整功能使用說明

## 功能概述

您的行程節點卡片現在已經新增了**時間調整功能**！用戶可以通過點擊三個小點按鈕來快速調整每個景點的停留時間，並且支援即時協作同步。

## 🎯 主要功能

### 1. 三個小點按鈕

- **位置**：每個節點卡片右上角
- **功能**：點擊後顯示/隱藏時間調整面板
- **狀態**：hover 時顏色會變深，提供視覺回饋

### 2. 時間調整面板

- **智能定位**：自動出現在按鈕右側
- **輸入驗證**：最小值 5 分鐘，步進值 5 分鐘
- **即時預覽**：顯示「目前時間 → 新時間」對比
- **操作按鈕**：確認/取消按鈕

### 3. 即時協作同步

- **Socket.IO 整合**：時間調整會即時同步給其他用戶
- **衝突避免**：只有操作者會看到自己的調整結果
- **狀態管理**：本地和遠端狀態完美同步

## 🚀 使用步驟

### 步驟 1：打開時間調整面板

1. 找到要調整時間的景點節點
2. 點擊節點卡片右上角的三個小點按鈕（⋯）
3. 時間調整面板會自動彈出

### 步驟 2：調整停留時間

1. 在「時間（分鐘）」輸入框中輸入新的時間
2. 可以用鍵盤輸入或點擊上下箭頭調整
3. 最小值：5 分鐘，建議以 5 分鐘為單位遞增
4. 即時預覽會顯示時間變化

### 步驟 3：確認或取消

1. **確認**：點擊藍色「✓ 確認」按鈕保存更改
2. **取消**：點擊灰色「✕ 取消」按鈕放棄更改
3. **點擊外部**：點擊面板外任何地方也會取消更改

## 🎨 界面設計

### 時間調整面板

```
┌─────────────────────────┐
│ 🕐 調整停留時間          │
├─────────────────────────┤
│ 時間（分鐘）: [60  ]     │
│ 目前: 45分鐘 → 新的: 60分鐘 │
│                         │
│ [✓ 確認]  [✕ 取消]      │
└─────────────────────────┘
```

### 視覺特色

- **懸浮效果**：面板有陰影和邊框，清楚分離
- **圖標指示**：時鐘圖標清楚表示功能用途
- **顏色編碼**：確認按鈕藍色，取消按鈕灰色
- **響應式設計**：面板會自動定位避免超出畫面

## 🔧 技術實現

### 前端功能

- **狀態管理**：使用 React useState 管理面板狀態
- **點擊外部偵測**：useEffect + useRef 實現點擊外部關閉
- **輸入驗證**：HTML5 number input 控制最小值和步進
- **即時預覽**：動態計算和顯示時間變化

### Socket.IO 事件

```typescript
// 發送時間調整事件
socket.emit('itinerary:timeChanged', {
  itineraryId: Number,
  dayIndex: Number,
  nodeIndex: Number,
  newDuration: Number,
  userId: String,
  userName: String,
  timestamp: String,
});

// 接收時間調整事件
socket.on('itinerary:timeChanged', (data) => {
  // 更新其他用戶的界面
});
```

### 🔧 後端修復代碼（重要！）

您的後端 Socket.IO 處理需要修復。請將您的時間調整事件處理替換為：

```javascript
// 處理時間調整事件 - 修復版本
socket.on("itinerary:timeChanged", (data) => {
  console.log("收到時間調整資料:", data);
  const { itineraryId, dayIndex, nodeIndex, newDuration, userId, userName } = data;
  const roomName = `itinerary_${itineraryId}`;
  
  // 確保用戶在房間內
  if (socket.rooms.has(roomName)) {
    // 廣播給同一房間的其他用戶（排除發送者）
    socket.to(roomName).emit("itinerary:timeChanged", data);
    console.log(`✅ 時間調整事件已廣播到房間 ${roomName}，用戶 ${userId} 調整了節點時間為 ${newDuration} 分鐘`);
  } else {
    console.error(`❌ 用戶 ${userId} 不在房間 ${roomName} 內，無法廣播時間調整事件`);
  }
  
  // 可選：保存到資料庫
  // await updateNodeDuration(itineraryId, dayIndex, nodeIndex, newDuration);
});
```

### 🔍 調試檢查清單

確保以下幾點都正確：

1. **房間加入**：用戶必須先加入行程房間
```javascript
socket.emit("itinerary:join", {
  itineraryId: your_itinerary_id,
  userId: your_user_id,
  userName: your_user_name
});
```

2. **事件發送格式**：確保 itineraryId 是數字
```javascript
socket.emit("itinerary:timeChanged", {
  itineraryId: Number(itineraryId), // 確保是數字
  dayIndex: dayIndex,
  nodeIndex: nodeIndex,
  newDuration: newDuration,
  userId: user.id.toString(),
  userName: user.nickname,
  timestamp: new Date().toISOString()
});
```

3. **控制台輸出**：檢查瀏覽器控制台和後端日誌

### 狀態更新邏輯

```typescript
// 本地狀態更新
setItineraryData((prev) => {
  const newData = prev.map((day, dayIndex) => {
    if (dayIndex === targetDayIndex) {
      const newNodes = day.Nodes.map((node, nodeIndex) => {
        if (nodeIndex === targetNodeIndex) {
          return { ...node, durationMinutes: newDuration };
        }
        return node;
      });
      return { ...day, Nodes: newNodes };
    }
    return day;
  });
  return newData;
});
```

## ⚙️ 自訂設定

### 修改時間限制

```typescript
// 在 node-card.tsx 中修改
<input
  type="number"
  min="5"      // 最小值
  step="5"     // 步進值
  max="480"    // 可新增最大值限制（8小時）
/>
```

### 修改預設時間單位

```typescript
// 修改顯示文字
<div className="text-xs text-gray-500">
  目前: {duration_minute} 分鐘 → 新的: {tempDuration} 分鐘
</div>
```

## 🐛 注意事項

### 使用限制

1. **最小時間**：停留時間不能少於 5 分鐘
2. **數值驗證**：只接受正整數輸入
3. **面板定位**：在畫面邊緣可能需要手動調整位置

### 最佳實踐

1. **合理時間**：建議設定符合實際的停留時間
2. **即時同步**：確保網路連線穩定以保持協作同步
3. **操作確認**：重要調整建議二次確認

## 🎉 未來擴展

可以考慮的功能增強：

- **時間模板**：預設常用時間選項（30分、1小時、2小時等）
- **批量調整**：一次調整多個節點的時間
- **智能建議**：根據景點類型自動建議合適時間
- **時間統計**：顯示每日總停留時間
- **歷史記錄**：記錄時間調整歷史

---

現在您可以在行程編輯頁面使用這個方便的時間調整功能了！⏰✨

## 📱 快捷操作

- **快速打開**：點擊 ⋯ 按鈕
- **快速確認**：Enter 鍵確認輸入
- **快速取消**：Escape 鍵或點擊外部
- **快速調整**：使用上下箭頭鍵微調時間
