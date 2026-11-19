export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  summary: string;
  role: string;
  highlights: string[];
  stack: string[];
  artworkVariant: 'transit' | 'sentinel';
}

export interface SemesterRecord {
  semester: string;
  gpa: number;
  maxGpa: number;
  percentageWidth: number;
}

export interface SkillGroup {
  index: string;
  title: string;
  detail: string;
}

export const PORTFOLIO_PROFILE = {
  shortName: 'D. Lathish Gokul',
  fullName: 'Dadiyala Lathish Gokul',
  headline: 'Building dependable software systems & thoughtful web interfaces.',
  subheadline:
    'Second-year B.Tech student in Computer Science and Engineering (AI & ML) at Jain University.',
  location: 'Tirupati, Andhra Pradesh',
  email: 'dadiyalalathishgokul@gmail.com',
  university: 'Jain University',
  degree: 'B.Tech, Computer Science and Engineering (AI & ML)',
  year: '2nd Year Undergraduate',
  about:
    'I am looking for a fresher role or software engineering internship where I can apply my programming fundamentals, data structures and algorithms, and full-stack project experience. I enjoy breaking down ambiguous problems, writing clean back-end logic, and collaborating within engineering teams.',
  availability: 'Open to internships and entry-level software engineering roles',
};

export const SEMESTER_RECORDS: SemesterRecord[] = [
  {
    semester: 'Semester 1',
    gpa: 7.05,
    maxGpa: 10,
    percentageWidth: 70.5,
  },
  {
    semester: 'Semester 2',
    gpa: 7.862,
    maxGpa: 10,
    percentageWidth: 78.62,
  },
];

export const SKILLS: SkillGroup[] = [
  {
    index: '01',
    title: 'Data Structures & Algorithms',
    detail:
      'Strong foundation in problem decomposition, algorithmic complexity, arrays, trees, graphs, and dynamic programming applied in regular coding practice.',
  },
  {
    index: '02',
    title: 'Back-End & Database Development',
    detail:
      'Designing structured schemas, API endpoints, server-side validation, and reliable query flows in Python and modern web runtimes.',
  },
  {
    index: '03',
    title: 'User Interface Design & Development',
    detail:
      'Crafting accessible, responsive front-end interfaces with clear typographic hierarchy, clean layout rhythm, and smooth user workflows.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'jain-transit',
    index: '01',
    title: 'Jain Transit',
    category: 'Smart Transportation · Web Application',
    summary:
      'A smart transportation website that helps university students track college buses, view live bus timings, and locate essential campus transit routes for reliable daily commutes.',
    role: 'Designed and contributed to the back-end architecture and database schema.',
    highlights: [
      'Structured route, stop, and bus schedule tables for fast lookup across peak campus hours.',
      'Built server-side endpoints to serve live timing updates and transit notices cleanly.',
      'Focused on predictable data consistency so students can verify departures at a glance.',
    ],
    stack: ['Back-End Logic', 'Database Schema', 'Transit Scheduling API'],
    artworkVariant: 'transit',
  },
  {
    id: 'wonderla-sentinel',
    index: '02',
    title: 'Wonderla Sentinel',
    category: 'Interactive AI · Digital Experience',
    summary:
      'An interactive, AI-powered experimental website built to explore creative engineering concepts, responsive artificial intelligence workflows, and expressive digital interfaces.',
    role: 'Contributed to design and front-end development, focusing on UI clarity, interactive flows, and responsiveness.',
    highlights: [
      'Designed an intuitive, low-friction interface that guides visitors through interactive AI scenarios.',
      'Balanced visual experimentation with accessible contrast, keyboard navigation, and responsive layouts.',
      'Collaborated closely on connecting front-end interactions with underlying intelligent responses.',
    ],
    stack: ['UI Engineering', 'Interactive Flows', 'AI Experimentation'],
    artworkVariant: 'sentinel',
  },
];

export const CERTIFICATIONS = [
  {
    title: 'Data Structures and Algorithms (DSA) Course & Certificate',
    period: '1 May 2025 – 7 August 2025',
    summary:
      'Completed intensive structured training covering core data structures, recursion, searching, sorting, graph traversal, and algorithmic problem solving.',
  },
];
