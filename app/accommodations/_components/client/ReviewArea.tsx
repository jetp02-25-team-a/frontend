'use client';

import React, { useState, useEffect } from 'react';

export interface ReviewAreaProps {
  accommodationId: number;
}

export default function ReviewArea({ accommodationId }: ReviewAreaProps) {
  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-semibold">評論區</h2>
        {/* TODO: CC fetch reviews */}
        <p>評論列表 (住宿ID: {accommodationId})</p>
      </div>
    </>
  );
}
