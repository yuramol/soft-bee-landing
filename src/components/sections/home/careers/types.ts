export interface CareersCardData {
  id: number;
  badge: string;
  title: string;
  description: string;
  vacancyDetails: {
    roleDescription: string;
    responsibilities: string[];
  };
}
