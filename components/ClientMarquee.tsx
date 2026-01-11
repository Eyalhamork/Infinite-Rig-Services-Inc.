"use client";

import { motion } from "framer-motion";

const clients = [
    { name: "NOCAL", subtitle: "National Oil Company of Liberia" },
    { name: "LPRC", subtitle: "Liberia Petroleum Refining Company" },
    { name: "MME", subtitle: "Ministry of Mines & Energy" },
    { name: "NPA", subtitle: "National Port Authority" },
    { name: "LiMA", subtitle: "Liberia Maritime Authority" },
    { name: "EPA", subtitle: "Environmental Protection Agency" },
    { name: "LPRA", subtitle: "Liberia Petroleum Regulatory Authority" },
    { name: "ZOIL", subtitle: "Zoil Limited Gh (Waste Management)" },
    { name: "JPN", subtitle: "JPN Offshore Int Ltd" },
    { name: "TSG", subtitle: "Seabird Group / TSG" },
    // Duplicate for seamless scroll
    { name: "NOCAL", subtitle: "National Oil Company of Liberia" },
    { name: "LPRC", subtitle: "Liberia Petroleum Refining Company" },
    { name: "MME", subtitle: "Ministry of Mines & Energy" },
    { name: "NPA", subtitle: "National Port Authority" },
    { name: "LiMA", subtitle: "Liberia Maritime Authority" },
    { name: "EPA", subtitle: "Environmental Protection Agency" },
    { name: "LPRA", subtitle: "Liberia Petroleum Regulatory Authority" },
    { name: "ZOIL", subtitle: "Zoil Limited Gh (Waste Management)" },
    { name: "JPN", subtitle: "JPN Offshore Int Ltd" },
    { name: "TSG", subtitle: "Seabird Group / TSG" },
];

export default function ClientMarquee() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="text-gray-500 font-semibold text-sm uppercase tracking-wide">
                        Trusted By Government, Industry Leaders & Strategic Partners
                    </span>
                </motion.div>
            </div>

            <div className="relative w-full max-w-[100vw] overflow-hidden">
                {/* Gradient Masks for Fade Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex">
                    <motion.div
                        className="flex space-x-12 px-4 whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30, // Adjust speed here
                        }}
                    >
                        {/* Render nicely to ensure we have enough width for scrolling */}
                        {[...clients, ...clients].map((client, i) => (
                            <div
                                key={i} // Index is safe here as this is static list
                                className="group flex flex-col items-center justify-center flex-shrink-0 cursor-default"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-navy/5 to-charcoal/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg border border-gray-100 group-hover:border-primary/20 transition-all duration-300">
                                    <span className="text-xl font-bold text-navy/70 group-hover:text-primary transition-colors">
                                        {client.name}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium group-hover:text-navy transition-colors max-w-[150px] text-center whitespace-normal">
                                    {client.subtitle}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
