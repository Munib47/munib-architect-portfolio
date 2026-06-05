export interface ResumeRole {
  title: string;
  startDate: string;
  endDate: string;       // 'Present' for active positions
  highlights: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  roles: ResumeRole[];
}
