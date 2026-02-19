// components/SectionTitle.tsx
type SectionTitleProps = {
  id?: string;
  title: string;
  subtitle?: string;
};

export function SectionTitle({ id, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2
        id={id}
        className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-zinc-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
