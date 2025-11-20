'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api-path';
import { useAuth } from '@/hooks/use-Auth';

export default function AddToTripButton({ spotId }: { spotId: number }) {
  const { user, isReady } = useAuth();
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!user?.id;

  // 點開 Modal 時抓使用者行程
  useEffect(() => {
    if (!open || !isReady || !isLoggedIn) return;

    const fetchTrips = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/m2/trip/user/${user.id}`);
        const text = await res.text();

        if (!res.ok) throw new Error(text);
        const json = JSON.parse(text);

        setTrips(json || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '讀取行程失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [open, isLoggedIn, isReady, user?.id]);

  async function handleAdd(tripId: number) {
    try {
      setAdding(true);

      const res = await fetch(`${API_URL}/api/m2/trip/${tripId}/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ placeId: spotId }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      alert('已加入行程！');
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert('加入行程失敗：' + err.message);
    } finally {
      setAdding(false);
    }
  }

  // 未登入提示
  if (isReady && !isLoggedIn) {
    return (
      <button
        className="rounded-full border border-yellow-500 px-4 py-2 text-yellow-700 hover:bg-yellow-50"
        onClick={() => alert('請先登入才能加入行程')}
      >
        加入行程
      </button>
    );
  }

  return (
    <>
      <button
        className="rounded-full bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600"
        onClick={() => setOpen(true)}
      >
        加入行程
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">加入到哪個行程？</h2>
              <button
                className="text-neutral-500"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-600">載入中...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : trips.length === 0 ? (
              <p className="text-sm text-neutral-500">
                目前沒有行程，請先建立行程。
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {trips.map((t: any) => (
                  <button
                    key={t.id}
                    disabled={adding}
                    className="w-full border p-3 rounded-lg hover:bg-neutral-50 text-left"
                    onClick={() => handleAdd(t.id)}
                  >
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-neutral-500">
                      {t.startDate?.slice(0, 10)} ~ {t.endDate?.slice(0, 10)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              className="mt-4 w-full rounded-xl border px-3 py-2 hover:bg-neutral-50"
              onClick={() => setOpen(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
