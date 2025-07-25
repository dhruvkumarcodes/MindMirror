import type { ReactElement } from "react";

export function SidebarItem({ text, icon }: {
    text?: string;
    icon?: ReactElement;
}) {
    return <div className="flex text-gray-700 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4 transition-all duration-200">
        <div className="p-2">
            {icon}
        </div>
        <div className="p-2 font-semibold">
            {text}
        </div>

    </div>

}