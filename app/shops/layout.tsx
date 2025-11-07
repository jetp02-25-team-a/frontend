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
