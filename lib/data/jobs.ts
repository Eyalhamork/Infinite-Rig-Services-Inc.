import { LucideIcon, Briefcase, Shield, Package, Users, Wrench } from "lucide-react";

export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    level: string;
    salary: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
    posted: string;
}

export const jobs: Job[] = [
    {
        id: "offshore-operations-manager",
        title: "Offshore Operations Manager",
        department: "Operations",
        location: "Monrovia, Liberia",
        type: "Full-time",
        level: "Senior",
        salary: "$80,000 - $120,000",
        description:
            "Lead offshore operations team, ensuring safety and efficiency in all platform activities. You will be responsible for coordinating drilling operations, managing crew rotations, and maintaining the highest safety standards across all offshore installations.",
        requirements: [
            "10+ years offshore experience",
            "Strong leadership skills",
            "HSE certification",
        ],
        responsibilities: [
            "Oversee daily offshore platform operations and drilling activities",
            "Manage and mentor a team of 50+ offshore personnel",
            "Develop and implement operational procedures and safety protocols",
            "Coordinate with onshore teams for logistics and supply chain needs",
            "Ensure compliance with international maritime and safety regulations",
            "Prepare operational reports and performance metrics",
            "Lead emergency response and crisis management activities",
        ],
        qualifications: [
            "Bachelor's degree in Engineering, Maritime Studies, or related field",
            "Minimum 10 years of offshore oil & gas experience",
            "At least 5 years in a supervisory or management role",
            "Valid BOSIET, HUET, and offshore medical certificates",
            "Strong understanding of HSE management systems",
            "Excellent communication and leadership skills",
            "Proficiency in relevant software and reporting tools",
        ],
        benefits: [
            "Competitive salary with performance bonuses",
            "Comprehensive health insurance for you and family",
            "28/28 rotation schedule",
            "Annual leave allowance",
            "Professional development opportunities",
            "Retirement savings plan",
        ],
        posted: "2 days ago",
    },
    {
        id: "supply-chain-coordinator",
        title: "Supply Chain Coordinator",
        department: "Logistics",
        location: "Monrovia, Liberia",
        type: "Full-time",
        level: "Mid-level",
        salary: "$45,000 - $65,000",
        description:
            "Coordinate procurement and logistics for offshore operations, managing vendor relationships and ensuring timely delivery of materials and equipment to offshore installations.",
        requirements: [
            "5+ years supply chain experience",
            "Procurement expertise",
            "Strong negotiation skills",
        ],
        responsibilities: [
            "Manage procurement processes from requisition to delivery",
            "Coordinate with vendors and suppliers for optimal pricing",
            "Track shipments and ensure timely offshore deliveries",
            "Maintain inventory levels and manage warehouse operations",
            "Process customs documentation and clearances",
            "Develop and maintain supplier relationships",
            "Generate supply chain reports and analytics",
        ],
        qualifications: [
            "Bachelor's degree in Supply Chain, Business, or related field",
            "Minimum 5 years of supply chain or logistics experience",
            "Experience in oil & gas or maritime industry preferred",
            "Strong Excel and ERP system skills",
            "Knowledge of customs and import regulations",
            "Excellent organizational and multitasking abilities",
        ],
        benefits: [
            "Competitive salary package",
            "Health and dental insurance",
            "Professional certification support",
            "Flexible working arrangements",
            "Annual performance bonus",
        ],
        posted: "5 days ago",
    },
    {
        id: "hse-officer",
        title: "HSE Officer",
        department: "Safety",
        location: "Monrovia, Liberia",
        type: "Full-time",
        level: "Mid-level",
        salary: "$50,000 - $70,000",
        description:
            "Develop and implement safety protocols, conduct audits, and ensure compliance with health, safety, and environmental regulations across all operations.",
        requirements: [
            "HSE certification",
            "3+ years experience",
            "Audit experience",
        ],
        responsibilities: [
            "Develop and maintain HSE policies and procedures",
            "Conduct safety audits and workplace inspections",
            "Lead incident investigations and root cause analysis",
            "Deliver safety training and awareness programs",
            "Monitor compliance with local and international regulations",
            "Prepare HSE reports and statistics",
            "Coordinate emergency response drills",
        ],
        qualifications: [
            "Bachelor's degree in Occupational Health, Safety, or related field",
            "NEBOSH or equivalent HSE certification required",
            "Minimum 3 years HSE experience in oil & gas industry",
            "Experience with ISO 14001 and OHSAS 18001 standards",
            "Strong analytical and problem-solving skills",
            "Excellent communication and training abilities",
        ],
        benefits: [
            "Competitive salary",
            "Comprehensive health coverage",
            "Continuous professional development",
            "Safety certification sponsorship",
            "Work-life balance initiatives",
        ],
        posted: "1 week ago",
    },
    {
        id: "recruitment-specialist",
        title: "Recruitment Specialist",
        department: "Manning",
        location: "Monrovia, Liberia",
        type: "Full-time",
        level: "Mid-level",
        salary: "$40,000 - $55,000",
        description:
            "Source and recruit qualified offshore personnel, manage certification processes, and build a talent pipeline for our growing operations.",
        requirements: [
            "HR experience",
            "Offshore industry knowledge",
            "Strong communication",
        ],
        responsibilities: [
            "Source and screen candidates for offshore positions",
            "Conduct interviews and coordinate hiring processes",
            "Manage candidate certification and training requirements",
            "Build and maintain talent databases",
            "Coordinate with clients on manning requirements",
            "Ensure compliance with employment regulations",
            "Develop recruitment strategies and employer branding",
        ],
        qualifications: [
            "Bachelor's degree in Human Resources, Business, or related field",
            "Minimum 3 years of recruitment experience",
            "Knowledge of offshore industry roles and requirements",
            "Experience with HRIS and ATS systems",
            "Strong interpersonal and networking skills",
            "Ability to work under pressure and meet deadlines",
        ],
        benefits: [
            "Competitive salary",
            "Performance bonuses",
            "Professional development",
            "Health insurance",
            "Flexible working options",
        ],
        posted: "3 days ago",
    },
    {
        id: "marine-engineer",
        title: "Marine Engineer",
        department: "Technical",
        location: "Offshore - Rotational",
        type: "Contract",
        level: "Senior",
        salary: "$90,000 - $130,000",
        description:
            "Maintain and repair offshore equipment, ensure operational reliability of all mechanical systems on platforms and support vessels.",
        requirements: [
            "Engineering degree",
            "8+ years experience",
            "Marine certifications",
        ],
        responsibilities: [
            "Maintain and repair marine and offshore equipment",
            "Conduct preventive maintenance programs",
            "Troubleshoot mechanical and electrical systems",
            "Manage spare parts inventory and procurement",
            "Ensure compliance with classification society requirements",
            "Prepare technical reports and maintenance logs",
            "Supervise maintenance crews and contractors",
        ],
        qualifications: [
            "Bachelor's degree in Marine Engineering or Mechanical Engineering",
            "Minimum 8 years of offshore or marine experience",
            "Valid Chief Engineer or equivalent certification",
            "Knowledge of classification society rules (DNV, ABS, Lloyd's)",
            "Strong technical troubleshooting skills",
            "Experience with planned maintenance systems",
        ],
        benefits: [
            "Premium salary package",
            "28/28 rotation schedule",
            "Comprehensive medical coverage",
            "Travel and accommodation provided",
            "Professional development allowance",
            "Performance bonuses",
        ],
        posted: "1 day ago",
    },
    {
        id: "logistics-analyst",
        title: "Logistics Analyst",
        department: "Logistics",
        location: "Monrovia, Liberia",
        type: "Full-time",
        level: "Entry",
        salary: "$35,000 - $45,000",
        description:
            "Analyze supply chain data, optimize routes, and support logistics operations to improve efficiency and reduce costs.",
        requirements: [
            "Bachelor degree",
            "Data analysis skills",
            "Excel proficiency",
        ],
        responsibilities: [
            "Analyze logistics data to identify improvement opportunities",
            "Create reports and dashboards for supply chain KPIs",
            "Support route optimization and scheduling",
            "Assist with inventory analysis and forecasting",
            "Coordinate with supply chain and operations teams",
            "Document processes and procedures",
            "Support cost reduction initiatives",
        ],
        qualifications: [
            "Bachelor's degree in Logistics, Business, or related field",
            "Strong analytical and problem-solving skills",
            "Advanced proficiency in Microsoft Excel",
            "Experience with data visualization tools preferred",
            "Good attention to detail",
            "Ability to work in a fast-paced environment",
        ],
        benefits: [
            "Competitive entry-level salary",
            "Health insurance",
            "Mentorship program",
            "Training and development",
            "Career advancement opportunities",
        ],
        posted: "4 days ago",
    },
];

export function getJobById(id: string): Job | undefined {
    return jobs.find((job) => job.id === id);
}

export function getJobsByDepartment(department: string): Job[] {
    if (department === "All") return jobs;
    return jobs.filter((job) => job.department === department);
}

export const departments = [
    "All",
    "Operations",
    "Logistics",
    "Safety",
    "Manning",
    "Technical",
];
