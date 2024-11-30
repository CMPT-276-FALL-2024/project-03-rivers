import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Link from "next/link"
import Helix from "./icons/helix"
  
export function AppSidebar() {
return (
    <Sidebar>
    <SidebarHeader className="h-16 border-b border-sidebar-border">
        <Link href="/" className="flex ml-6 gap-2"> 
            <Helix 
                color="orange" 
                size={30} 
                speed={2.5}
                className="my-2" 
            />
            <h1 className="text-orange-500 font-extrabold text-xl">RNA</h1>
        </Link>
    </SidebarHeader>
    <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
    </SidebarContent>
    <SidebarFooter />
    </Sidebar>
)
}
  