import * as React from "react";
import {
    ChartLineDownIcon,
    MagnifyingGlassIcon,
    GlobeHemisphereWestIcon,
    ArchiveIcon,
    FileDashedIcon,
    UsersThreeIcon,
    WrenchIcon,
    XCircleIcon
} from "@phosphor-icons/react";

interface SupportTopic {
    id: string;
    icon: React.ReactNode;
    text: string;
    boldText?: string;
}

const supportTopics: SupportTopic[] = [
    {
        id: "not-enough-jobs",
        icon: <ChartLineDownIcon size={20} weight="regular" />,
        text: "applied",
        boldText: "Not enough jobs",
    },
    {
        id: "irrelevant-jobs",
        icon: <MagnifyingGlassIcon size={20} weight="regular" />,
        text: "irrelevant jobs",
        boldText: "Copilot applies to",
    },
    {
        id: "wrong-countries",
        icon: <GlobeHemisphereWestIcon size={20} weight="regular" />,
        text: "wrong countries",
        boldText: "Copilot applies to",
    },
    {
        id: "old-closed-jobs",
        icon: <ArchiveIcon size={20} weight="regular" />,
        text: "old/closed jobs",
        boldText: "Copilot applies to",
    },
    {
        id: "view-application",
        icon: <FileDashedIcon size={20} weight="regular" />,
        text:"",
        boldText: "How to view the submitted CV and Application details?",
    },
    {
        id: "not-enough-interviews",
        icon: <UsersThreeIcon size={20} weight="regular" />,
        text: "enough job interviews",
        boldText: "Not getting",
    },
    {
        id: "tailored-cv",
        icon: <WrenchIcon size={20} weight="regular" />,
        text: "for each job?",
        boldText: "Tailored CV",
    },
    {
        id: "cancel-subscription",
        icon: <XCircleIcon size={20} weight="regular" />,
        text: "my subscription",
        boldText: "Cancel",
    },
];

export function Page(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
                    What can we help with?
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {supportTopics.map((topic) => (
                        <button
                            key={topic.id}
                            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 text-left w-full border border-gray-200/50 flex items-center gap-3"
                        >
                            <div className="flex-shrink-0 text-gray-700">
                                {topic.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900">
                                    {topic.boldText && (
                                        <span className="font-semibold">{topic.boldText}</span>
                                    )}
                                    {topic.text && (
                                        topic.boldText ? (
                                            <span className="font-normal"> {topic.text}</span>
                                        ) : (
                                            <span className="font-normal">{topic.text}</span>
                                        )
                                    )}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200 text-center font-semibold text-gray-900 border border-gray-200">
                        Something else
                    </button>
                    <button className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200 text-center font-semibold text-gray-900 border border-gray-200">
                        View full FAQ
                    </button>
                </div>
            </div>
        </div>
    );
}
