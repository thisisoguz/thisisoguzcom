export type ResumeHeader = {
  name: string;
  title: string;
  location?: string;
  contacts: Array<{
    label: string;
    href: string;
  }>;
};

export type ResumeEntry = {
  id: string;
  period: string;
  location?: string;
  title: string;
  organization: string;
  description?: string;
  responsibilities?: string[];
};

export type ExternalCertificate = {
  id: string;
  title: string;
  type: "external";
  href: string;
};

export type ImageCertificate = {
  id: string;
  title: string;
  type: "image";
  imageUrl: string;
  imageAlt: string;
  width: number;
  height: number;
};

export type Certificate = ExternalCertificate | ImageCertificate;

export type Language = {
  name: string;
  level: string;
};

export type SkillGroup = {
  name: string;
  skills: string[];
};

export const resumeHeader: ResumeHeader = {
  name: "Oguz Yilmaz",
  title: "Test Automation Engineer | ISTQB CTFL",
  contacts: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/thisisoguz/" },
    { label: "github.com/thisisoguz", href: "https://github.com/thisisoguz/" },
    { label: "yilmazoguz@outlook.com", href: "mailto:yilmazoguz@outlook.com" },
    { label: "thisisoguz.com", href: "https://thisisoguz.com/" },
  ],
};

export const profile =
  "Test Automation Engineer with 4+ years of experience in quality assurance and test automation for complex enterprise applications in the insurance sector. Experienced in UI, API, backend, SAP GUI, and end-to-end testing, with hands-on expertise in building and maintaining reusable automation solutions, data-driven testing, and CI/CD-integrated test execution.";

export const workExperience: ResumeEntry[] = [
  {
    id: "etb-group",
    period: "06/2022 – Current",
    location: "Turkey",
    title: "Software Test Engineer",
    organization: "ETB-Group — Client: HDI Insurance Germany",
    responsibilities: [
      "Designed, maintained, and enhanced automated test solutions for complex enterprise insurance applications covering SAP GUI, web interfaces, APIs, and document/PDF workflows.",
      "Developed reusable and maintainable test automation components using UFT and VBScript, including data-driven and parameterized test scenarios for large-scale regression testing.",
      "Integrated and executed automated smoke and regression tests within GitLab CI/CD workflows, analyzing test results and providing fast feedback on software quality and release readiness.",
      "Executed and managed approximately 5,000 test cases per bi-weekly sprint across functional, smoke, GUI, end-to-end, API, and regression testing.",
      "Identified, analyzed, and documented software defects and managed their lifecycle using HP Octane and HP ALM, collaborating with development and business teams through resolution.",
      "Performed API and backend testing using SoapUI, XML, and SQL, validating data consistency and communication across integrated enterprise systems.",
      "Contributed to test strategy, test coverage, and quality improvement discussions across multiple cross-functional Scrum and Kanban teams.",
      "Worked closely with developers, business analysts, and other stakeholders to clarify requirements, identify testing risks, and design effective test scenarios.",
    ],
  },
];

export const certificates: Certificate[] = [
  {
    id: "istqb-ctfl",
    title: "ISTQB® Certified Tester Foundation Level (CTFL)",
    type: "external",
    href: "https://app.diplomasafe.com/en-US/diploma/d093917c60dafa743314dbcd85e8928eba00abbe5",
  },
];

export const skills: SkillGroup[] = [
  {
    name: "Test Automation",
    skills: [
      "UFT (VBScript)",
      "Playwright (TypeScript)",
      "Selenium (Python)",
      "Karate (API)",
      "SoapUI",
    ],
  },
  {
    name: "Programming & Scripting",
    skills: [
      "TypeScript / JavaScript",
      "Node.js/npm",
      "VBScript",
      "Python",
      "SQL",
      "XML",
    ],
  },
  {
    name: "Test Automation Frameworks",
    skills: [
      "Framework Design & Maintenance",
      "Reusable Test Components",
      "Data-Driven Testing",
      "Parameterized Testing",
    ],
  },
  {
    name: "Testing",
    skills: [
      "UI Testing",
      "API Testing",
      "Backend Testing",
      "E2E Testing",
      "Regression Testing",
      "Smoke Testing",
      "Integration Testing",
    ],
  },
  {
    name: "CI/CD & Version Control",
    skills: ["GitLab CI/CD", "Git"],
  },
  {
    name: "Test Management & Defect Tracking",
    skills: ["HP ALM", "HP Octane"],
  },
  {
    name: "Quality Engineering",
    skills: [
      "Test Strategy",
      "Test Coverage",
      "Requirements Analysis",
      "Risk-Based Testing",
      "Scenario Design",
    ],
  },
  {
    name: "Ways of Working",
    skills: ["Agile", "Scrum", "Kanban", "Cross-functional Collaboration"],
  },
];

export const education: ResumeEntry[] = [
  {
    id: "astound-commerce",
    period: "02/2022 – 05/2022",
    location: "Turkey",
    title: "Software QA Engineer Trainee",
    organization: "Astound Commerce",
  },
  {
    id: "recoded",
    period: "01/2022 – 05/2022",
    title: "React.js Web Development Bootcamp, Front-end Development",
    organization: "Re:coded",
  },
  {
    id: "patika",
    period: "02/2022 – 03/2022",
    location: "Turkey",
    title: "Data Analytics (Organized in collaboration with Trendyol)",
    organization: "Patika.dev",
  },
  {
    id: "university",
    period: "09/2013 – 06/2018",
    location: "Turkey",
    title: "Bachelor's Degree in Geomatics Engineering (100% English)",
    organization: "Izmir Katip Celebi University",
  },
];

export const languages: Language[] = [
  { name: "English", level: "C1 / Professional Working Proficiency" },
  { name: "German", level: "Conversational" },
];
