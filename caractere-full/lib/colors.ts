// 12 couleurs distinctes pour les employés
export const EMPLOYEE_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EABB08", // Amber
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#64748B", // Slate
];

export function employeeColorLabel(hex: string): string {
  const labels: Record<string, string> = {
    "#EF4444": "Rouge",
    "#F97316": "Orange",
    "#EABB08": "Ambre",
    "#84CC16": "Citron",
    "#22C55E": "Vert",
    "#10B981": "Émeraude",
    "#14B8A6": "Sarcelle",
    "#06B6D4": "Cyan",
    "#0EA5E9": "Ciel",
    "#3B82F6": "Bleu",
    "#EC4899": "Rose",
    "#64748B": "Ardoise",
  };
  return labels[hex] || hex;
}
