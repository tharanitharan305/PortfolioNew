export interface TechItem {
  name: string;
  durationMonths: number;
}

export interface Milestone {
  id: number;
  period: string;
  title: string;
  role: string;
  org: string;
  orgInitials: string;
  type: "education" | "work";
  tech: TechItem[];
}
