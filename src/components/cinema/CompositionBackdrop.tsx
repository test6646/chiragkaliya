type Rule =
  | "thirds" | "golden" | "symmetry" | "asymmetry"
  | "leading-lines" | "negative-space" | "balance";

interface Props { rule?: Rule; visible?: boolean; className?: string }

export function CompositionBackdrop(_: Props) {
  return null;
}
