import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  phase: string;
};

/** Shared placeholder until each phase builds real UI */
export function PageHeader({ title, description, phase }: Props) {
  return (
    <div className="mb-8">
      <p className="text-[11px] tracking-[0.25em] text-gold uppercase">{phase}</p>
      <h1 className="mt-2 font-heading text-3xl text-white md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">{description}</p>
    </div>
  );
}

export function ComingSoonCard({ items }: { items: string[] }) {
  return (
    <div className="border border-white/10 bg-background-secondary/80 p-6">
      <p className="text-sm text-muted">This module shell is ready. Next build steps:</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-foreground/90">
            <span className="text-gold">▸</span>
            {item}
          </li>
        ))}
      </ul>
      <Link
        to="/"
        className="mt-6 inline-flex cursor-pointer border border-gold/50 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
