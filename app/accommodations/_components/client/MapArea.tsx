'use client';

import React, { useState, useEffect } from 'react';

export interface MapAreaProps {
  latitude: number;
  longitude: number;
}

export default function MapArea({ latitude, longitude }: MapAreaProps) {
  return (
    <>
      <div className="w-full h-64 bg-gray-200">
        {/* TODO: 地圖互動 */}
        <p>
          地圖區塊 (lat: {latitude}, lng: {longitude})
        </p>
      </div>
    </>
  );
}
