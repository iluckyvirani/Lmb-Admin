import { PageHeader, ComingSoonCard } from "@/components/ui/PageHeader";

type Props = {
  title: string;
  description: string;
  phase: string;
  items: string[];
};

export function PlaceholderPage({ title, description, phase, items }: Props) {
  return (
    <>
      <PageHeader title={title} description={description} phase={phase} />
      <ComingSoonCard items={items} />
    </>
  );
}
