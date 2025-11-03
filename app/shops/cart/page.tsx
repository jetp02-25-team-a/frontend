'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '../../../hooks/use-Auth';

export default function CartPage() {
  useAuthRequired();
  return (
    <>
      <div>Cart Page</div>
    </>
  );
}
