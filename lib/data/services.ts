import {
    Anchor,
    Package,
    Briefcase,
    Shield
} from "lucide-react";

export const heroServices = [
    {
        id: "offshore",
        title: "Offshore Operations",
        description: "Expert technical support and operations for drilling rigs and offshore platforms with highly trained crews.",
        icon: Anchor,
        gradient: "from-blue-600 to-indigo-900",
        image: "/images/hero-offshore.png",
        link: "/services/offshore",
        color: "blue",
        badge: "Offshore Excellence"
    },
    {
        id: "supply",
        title: "Supply Chain Solutions",
        description: "Efficient procurement, logistics, and transportation ensuring seamless operations in remote environments.",
        icon: Package,
        gradient: "from-teal-600 to-emerald-900",
        image: "/images/hero-supply.png",
        link: "/services/supply",
        color: "green",
        badge: "Global Logistics"
    },
    {
        id: "manning",
        title: "Manning Services",
        description: "Recruitment, training, and certification of qualified offshore personnel and specialized crew members.",
        icon: Briefcase,
        gradient: "from-violet-600 to-fuchsia-900",
        image: "/images/hero-manning.png",
        link: "/services/manning",
        color: "purple",
        badge: "Expert Crewing"
    },
    {
        id: "hse",
        title: "HSE Consulting",
        description: "Comprehensive Health, Safety, and Environmental consulting to ensure zero-incident operations.",
        icon: Shield,
        gradient: "from-amber-500 to-orange-900",
        image: "/images/hero-hse.png",
        link: "/services/hse",
        color: "orange",
        badge: "Safety First"
    }
];
