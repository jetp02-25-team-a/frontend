import React from 'react';

// 1. 定義 ModalProps 接口 (Interface)
interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

// 2. 定義 SimpleModal 函數組件
const SimpleModal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // 外層覆蓋層/定位容器: 固定定位在畫面中央下方 (fixed, bottom-50, z-50)
    <div className="fixed bottom-50 z-50 w-full max-w-sm left-1/2 -translate-x-1/2">
      {/* Modal 內容區塊: 白底、圓角、陰影、固定寬度 */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        {/* 訊息內容 */}
        <p className="mb-6">{message}</p>

        {/* 按鈕容器: 靠右對齊 */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
