"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
    Briefcase,
    Anchor,
    ShieldCheck,
    Truck,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    Trash2
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ServiceType = "manning" | "offshore" | "hse" | "supply" | "waste";

interface ServiceOption {
    id: ServiceType;
    title: string;
    description: string;
    icon: React.ElementType;
}

const services: ServiceOption[] = [
    {
        id: "manning",
        title: "Technical Manning",
        description: "Certified crew and technical personnel for marine operations.",
        icon: Briefcase,
    },
    {
        id: "offshore",
        title: "Offshore/Technical Services",
        description: "Specialized rig services, maintenance, and technical support.",
        icon: Anchor,
    },
    {
        id: "hse",
        title: "HSE & Training",
        description: "Safety audits, compliance training, and certifications.",
        icon: ShieldCheck,
    },
    {
        id: "supply",
        title: "Supply Chain & Logistics",
        description: "Procurement, vessel chartering, and logistics support.",
        icon: Truck,
    },
    {
        id: "waste",
        title: "Waste Management",
        description: "Hazardous waste handling, recycling, and disposal services.",
        icon: Trash2,
    },
];

export default function NewRequestPage() {
    const router = useRouter();
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService) return;

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: client } = await supabase
                .from("clients")
                .select("id")
                .eq("primary_contact_id", user.id)
                .single();

            if (!client) throw new Error("Client record not found");

            const { error } = await supabase
                .from("service_requests")
                .insert({
                    client_id: client.id,
                    service_type: selectedService,
                    details: formData,
                    status: "pending",
                });

            if (error) throw error;

            toast.success("Request Submitted", {
                description: "We will review your request and get back to you shortly.",
            });
            router.push("/portal/requests");
        } catch (error: any) {
            console.error("Error submitting request:", error);
            toast.error("Submission failed", { description: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormFields = () => {
        switch (selectedService) {
            case "manning":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position / Role *</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Master, Chief Engineer" onChange={(e) => handleInputChange("position", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                                <input required type="number" min="1" className="w-full p-2.5 border rounded-lg" placeholder="1" onChange={(e) => handleInputChange("quantity", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. 6 months" onChange={(e) => handleInputChange("duration", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Required Certifications</label>
                                <input type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. STCW, BOSIET" onChange={(e) => handleInputChange("certifications", e.target.value)} />
                            </div>
                        </div>
                    </>
                );
            case "offshore":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Required *</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Rig Maintenance" onChange={(e) => handleInputChange("service_name", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset / Rig Type</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Jack-up Rig" onChange={(e) => handleInputChange("asset_type", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Offshore Ghana" onChange={(e) => handleInputChange("location", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Start Date</label>
                                <input required type="date" className="w-full p-2.5 border rounded-lg" onChange={(e) => handleInputChange("start_date", e.target.value)} />
                            </div>
                        </div>
                    </>
                );
            case "hse":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Service *</label>
                                <select className="w-full p-2.5 border rounded-lg bg-white" onChange={(e) => handleInputChange("hse_type", e.target.value)}>
                                    <option value="">Select Type</option>
                                    <option value="training">Training</option>
                                    <option value="audit">Safety Audit</option>
                                    <option value="consultancy">Consultancy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Trainees / Scope</label>
                                <input type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. 15 pax" onChange={(e) => handleInputChange("scope", e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Dates</label>
                                <input type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. First week of March" onChange={(e) => handleInputChange("dates", e.target.value)} />
                            </div>
                        </div>
                    </>
                );
            case "supply":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item / Service Needed *</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Safety Equipment" onChange={(e) => handleInputChange("item_name", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. 100 units" onChange={(e) => handleInputChange("quantity", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Takoradi Port" onChange={(e) => handleInputChange("location", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select className="w-full p-2.5 border rounded-lg bg-white" onChange={(e) => handleInputChange("priority", e.target.value)}>
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>
                    </>
                );
            case "waste":
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type *</label>
                                <select className="w-full p-2.5 border rounded-lg bg-white" onChange={(e) => handleInputChange("waste_type", e.target.value)}>
                                    <option value="">Select Type</option>
                                    <option value="hazardous">Hazardous (Chemical/Oil)</option>
                                    <option value="non-hazardous">Non-Hazardous (General/Recyclable)</option>
                                    <option value="mixed">Mixed Waste</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Volume/Weight</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. 500kg or 10 Drums" onChange={(e) => handleInputChange("volume", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Rig Alpha Platform" onChange={(e) => handleInputChange("location", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Handling Requirements</label>
                                <input type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Special containers needed" onChange={(e) => handleInputChange("handling", e.target.value)} />
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!selectedService) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Request Service</h1>
                    <p className="text-gray-500">Select the type of service you need</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => {
                                setSelectedService(service.id);
                                setFormData({});
                            }}
                            className="flex items-start p-6 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all text-left group"
                        >
                            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                <service.icon className="w-6 h-6 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-lg text-navy-900 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                            </div>
                            <ChevronRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-primary self-center" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const ServiceIcon = services.find(s => s.id === selectedService)?.icon || Briefcase;

    return (
        <div className="space-y-6 max-w-3xl">
            <button
                onClick={() => setSelectedService(null)}
                className="flex items-center text-sm text-gray-500 hover:text-navy-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Services
            </button>

            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ServiceIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-navy-900">
                        {services.find(s => s.id === selectedService)?.title} Request
                    </h1>
                </div>
                <p className="text-gray-500">Please provide details about your requirements.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Detailed Fields */}
                    {renderFormFields()}

                    {/* Common Fields */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details / Description</label>
                            <textarea
                                rows={4}
                                className="w-full p-2.5 border rounded-lg resize-none"
                                placeholder="Please describe any specific requirements or context..."
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedService(null)}
                                className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Request"}
                                {!submitting && <ChevronRight className="w-4 h-4 ml-2" />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
