import { PiShoppingCartSimpleBold } from 'react-icons/pi';
import Link from 'next/link';
import { CartProvider } from '../../hooks/use-Cart';

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>{children}</CartProvider>
    </>
  );
}
