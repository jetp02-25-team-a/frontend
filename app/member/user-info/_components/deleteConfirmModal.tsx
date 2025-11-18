import React, { useState } from 'react';
import Modal from 'react-modal';
import { API_SERVER } from '../../../config/api-path';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
// Modal.setAppElement('#__next'); // Next.js 要加這行

interface DeleteConfirmModalProps {
  itineraryId: number;
  isOpen: boolean;
  onRequestClose: () => void;
}

export default function DeleteConfirmModal({
  itineraryId,
  isOpen,
  onRequestClose,
}: DeleteConfirmModalProps) {
  // const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement(document.body);
    }
  }, []);
  //根據行程id 刪除 行程
  const deleteItineraryById = async (itineraryId: number) => {
    console.log('Deleting itinerary with ID:', itineraryId);
    console.log(
      'Deleting itinerary with ID:',
      `${API_SERVER}/itineraries/delete/${itineraryId}`
    );
    try {
      const url = `${API_SERVER}/itineraries/delete/${itineraryId}`;
      const token =
        'Bearer ' +
        JSON.parse(localStorage.getItem('BackpackUserInfo') || '{}').token;

      const result = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      }).then((r) => r.json());

      if (result.success) {
        toast.success('成功刪除行程');
        // 刪除後重新取得行程列表
        // handelUserItineraries();
      } else {
        toast.error('刪除行程失敗');
        // handelUserItineraries();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>刪除</button> */}
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          content: {
            width: '320px',
            height: '180px',
            margin: 'auto',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
        }}
      >
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>
          確定要刪除嗎？
        </h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: '#F87171',
              color: '#fff',
            }}
            onClick={() => {
              deleteItineraryById(itineraryId);
              onRequestClose();
            }}
          >
            確定
          </button>
          <button
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: '#FBBF24',
              color: '#fff',
            }}
            onClick={onRequestClose}
          >
            取消
          </button>
        </div>
      </Modal>
    </>
  );
}
