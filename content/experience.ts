export type ResumeHeader = {
  name: string;
  title: string;
  location: string;
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

export const resumeHeader: ResumeHeader = {
  name: "Oguz Yilmaz",
  title: "Software Test Engineer | ISTQB CTFL",
  location: "Izmir, Turkey",
  contacts: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/thisisoguz/" },
    { label: "GitHub", href: "https://github.com/thisisoguz/" },
    { label: "yilmazoguz@outlook.com", href: "mailto:yilmazoguz@outlook.com" },
  ],
};

export const profile =
  "Experienced Software Test Engineer with a strong background in creating and maintaining test automation scripts to streamline testing processes and ensure alignment with project requirements. Highly detail-oriented, with a focus on bug reporting and tracking. Recognized for an agile mindset and proficiency in frameworks such as Scrum and Kanban, with a proven ability to adapt to changing project needs and contribute to high-quality results within cross-functional teams.";

export const workExperience: ResumeEntry[] = [
  {
    id: "etb-group",
    period: "06/2022 - Current",
    location: "Turkey",
    title: "Software Test Engineer",
    organization: "ETB-Group (outsource to HDI Versicherung Deutschland)",
    responsibilities: [
      "Created test cases for SAP, GUI, and PDFs, ensuring comprehensive coverage and contributing to improved product quality and fewer defects.",
      "Developed, documented, and maintained test automation scripts using VBScript in UFT, simplifying the testing process and increasing overall efficiency.",
      "Conducted functional, smoke, GUI, E2E (end-to-end), and regression tests, increasing test coverage and software stability, while helping speed up release cycles.",
      "Identified and analyzed errors during testing, enabling quicker issue detection and resolution, reducing project risks.",
      "Managed defect tracking and resolution in HP Octane, securing effective defect management and faster resolution times, resulting in higher software quality.",
      "Executed and managed test cases in ALM.net (HP ALM), processing around 5000 tests per bi-weekly sprint, maintaining consistent execution and faster feedback.",
      "Queried XML files via SoapUI to validate data and check API functionality, supporting data integrity and efficient system communication.",
      "Utilized SQL to query database data, ensuring test data accuracy and completeness, which enhanced the quality of data-driven tests.",
      "Actively participated in agile practices (Scrum, Kanban) and worked across multiple cross-functional teams, contributing to improved collaboration and timely project delivery.",
    ],
  },
];

export const certificates: Certificate[] = [
  {
    id: "istqb-ctfl",
    title: "ISTQB Foundation Level (CTFL) Certificate",
    type: "external",
    href: "https://app.diplomasafe.com/en-US/diploma/d093917c60dafa743314dbcd85e8928eba00abbe5",
  },
  {
    id: "astound-qa-bootcamp",
    title: "Astound Europen QA Bootcamp",
    type: "image",
    imageUrl: "/certificates/astound_qabootcamp_certificate.jpg",
    imageAlt: "Astound Europen QA Bootcamp certificate for Oguz Yilmaz",
    width: 1505,
    height: 2200,
  },
  {
    id: "react-web-development-bootcamp",
    title: "React Web Development Bootcamp",
    type: "image",
    imageUrl: "/certificates/recoded_graduate_certificate.png",
    imageAlt: "React Web Development Bootcamp certificate for Oguz Yilmaz",
    width: 1920,
    height: 1080,
  },
  {
    id: "trendyol-data-analytics",
    title: "161. Trendyol Data Analytics Bootcamp",
    type: "external",
    href: "https://verified.sertifier.com/en/verify/20912531044624/",
  },
];

export const education: ResumeEntry[] = [
  {
    id: "astound-commerce",
    period: "02/2022 - 05/2022",
    location: "Turkey",
    title: "Software QA Engineer Trainee",
    organization: "Astound Commerce",
    description:
      "As a Software QA Engineer Trainee at Astound Commerce, I gained experience in requirements analysis, test case design, and applying testing techniques such as equivalence class partitioning and boundary value analysis. I conducted regression and cross-browser testing to verify product quality, and handled bug reporting and test result validation using Jira with Xray and Zephyr for test management.",
  },
  {
    id: "recoded",
    period: "01/2022 - 05/2022",
    title: "React.js Web Development Bootcamp, Front-end Development",
    organization: "Re:coded",
    description:
      "I completed a 4.5-month immersive coding bootcamp with 300+ hours of curriculum, covering React.js, Context APIs, Redux for state management, and unit testing with React Testing Library. I collaborated on building responsive web applications, including the development of a capstone project, the Student Teach platform.",
  },
  {
    id: "patika",
    period: "02/2022 - 03/2022",
    location: "Turkey",
    title: "Data Analytics",
    organization: "Patika.dev",
    description:
      "I was selected for the bootcamp after successfully passing several stages, including technical and soft skills interviews, and was among the top 40 candidates out of nearly 2500 applicants. The curriculum covered a range of topics, including SQL 101 (Google BQ), Python for Data Analytics, and various statistical analyses such as regression, cluster analysis, and inferential statistics, along with data visualizations using Python.",
  },
  {
    id: "university",
    period: "09/2013 - 06/2018",
    location: "Turkey",
    title: "Bachelor's Degree in Geomatics Engineering (100% English)",
    organization: "Izmir Katip Celebi University",
    description:
      "I graduated with a GPA of 3.05/4 after completing 1 year of English preparatory class followed by 4 years of undergraduate studies.",
  },
];

export const languages: Language[] = [
  { name: "Turkish", level: "Native/Bilingual" },
  { name: "English", level: "Native/Bilingual" },
  { name: "German", level: "Conversational" },
];
