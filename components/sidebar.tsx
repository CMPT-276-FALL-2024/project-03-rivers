import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
// import { data } from "@/data" // Adjust the import path as necessary
import Link from "next/link"
import Helix from "./icons/helix"
import { DatePicker } from "./date-picker"
import { Calendars } from "./calendars"
  
export function AppSidebar() {
return (
    <Sidebar>
    <SidebarHeader className="h-16 border-b border-sidebar-border justify-center">
        <Link href="/" className="flex ml-6 gap-2"> 
            <Helix 
                color="orange" 
                size={30} 
                speed={2.5}
                className="my-2" 
            />
            <h1 className="text-orange-500 font-extrabold text-2xl">RNA</h1>
        </Link>
    </SidebarHeader>
    <SidebarContent>
        <SidebarGroup />
        {/* <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={[]} /> */}
    </SidebarContent>
    <SidebarFooter className="h-24 justify-center border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
                    <NavUser
                        user={{
                            name: "John Doe",
                            email: "Vb9bM@example.com",
                            avatar: "/placeholder-avatar.png",
                        }}
                    />
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarFooter>
    </Sidebar>
)
}
  