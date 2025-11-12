export interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Section({ className, children }: SectionProps) {
  return (
    <>
      <section className={`w-full p-16 ${className}`}>
        <div className="w-full flex flex-col items-center gap-8">
          {children}
        </div>
      </section>
    </>
  );
}
