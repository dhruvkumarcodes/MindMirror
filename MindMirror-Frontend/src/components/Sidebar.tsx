import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SideBarItem";

export function Sidebar() {
    return (
        <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-4">
            <div className="flex text-2xl items-center pt-4">
                <div className="pr-2 text-purple-600">
                    <Logo />
                </div>
                MindMirror
            </div>
            <div className="pt-8 pl-4">
                <SidebarItem text="Twitter" icon={<TwitterIcon />} />
                <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
            </div>
        </div>
    )
}