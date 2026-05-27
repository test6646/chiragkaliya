interface Props {
  index: string;
  label: string;
  meta?: string;
}
/** Quiet mono caption — gold index, hairline divider. */
export function Marks({ index, label, meta }: Props) {
  return (
    <div className="flex items-baseline gap-6">
      <span className="cap cap-gold">{index}</span>
      <span className="h-px flex-1 bg-gold/30" />
      <span className="cap cap-ink">{label}</span>
      {meta && <span className="cap hidden md:inline">{meta}</span>}
    </div>
  );
}
