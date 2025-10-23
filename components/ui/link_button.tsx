export default function LinkButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="rounded-full border-2 border-white w-[24px] h-[24px] p-4 flex items-center justify-center">
        {children}
      </div>
    </>
  );
}
