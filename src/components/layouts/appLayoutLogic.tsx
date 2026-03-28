import {  FileText, Home,  Minus, Plus,  User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/features/auth/auth.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import LogoutAlertDialog from "./LogoutAlertDialog";
import EditUserDialog from "./editMyInfo";
import { Link, useLocation } from "react-router-dom";

type BaseMenuItem = {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type MenuLinkItem = BaseMenuItem & {
  url: string;
  children?: never;
};

type MenuParentItem = BaseMenuItem & {
  children: MenuLinkItem[];
  url?: never;
};
type MenuItem = MenuLinkItem | MenuParentItem;
const menu_items: MenuItem[] = [
  { title: "Home", url: "/", icon: Home },
  {
    title: "Blog",
    icon: FileText,
    children: [
      { title: "Create Blog", url: "/create-blog" },
      { title: "My Blog", url: "/my-blogs" },
    ],
  },
];

const admin_item = [
  {title: "Blogs", url: "/manage-blogs", icon:FileText},
  {title: "Users", url: "/manage-users", icon:User}
]
export function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string, value: boolean) => {
    setOpenMenus((prev) => ({ ...prev, [title]: value }));
  };

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);
  
  return (
    <>
      {/* Sidebar */}
      <Sidebar collapsible="icon">
        {/* Sidebar content */}
        <SidebarContent className="mt-10">
          <SidebarMenu>
            {
            user?.role === "admin" 
            ?
            admin_item.map((adminItem) => {
              const Icon = adminItem.icon;
              return(
                <SidebarMenuItem key={adminItem.title}>
                  <SidebarMenuButton asChild>
                    {adminItem.url && (
                      <Link to={adminItem.url} className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5" />}

                        {/* Hide text when collapsed */}
                        {<span>{adminItem.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }) 
            :
            menu_items.map((item) => {
              const Icon = item.icon;
              if (item.children && item.children.length > 0) {
                return (
                  <SidebarMenuItem key={item.title}>
                    {/* Drop menu for child of menu items (blog) */}
                    <DropdownMenu
                      open={!!openMenus[item.title]}
                      onOpenChange={(value) => toggleMenu(item.title, value)}
                    >
                      {/* Trigeer for blog to open createBlog and My Blog child (Modal)  */}
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between px-2 focus:outline-0 "
                        >
                          <div className="flex items-center gap-2 ">
                            {Icon && <Icon className="h-5 w-5" />}
                            {open && <span>{item.title}</span>}
                          </div>

                          {open &&
                            (openMenus[item.title] ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            ))}
                        </button>
                      </DropdownMenuTrigger>
                      
                            {/* Children items map */}
                      <DropdownMenuContent side="bottom" align="end">
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.title} asChild>
                            <Link to={child.url}>{child.title}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              }
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.url && (
                      <Link to={item.url} className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5" />}

                        {/* Hide text when collapsed */}
                        {<span>{item.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
{/* Sidebar footer */}
        <SidebarFooter>
          <DropdownMenu>
              <DropdownMenuTrigger className={`flex   items-center gap-2 rounded hover:bg-gray-100 dark:hover:bg-[#262626] p-0 transition-color duration-200 ease-in-out focus:outline-none focus:ring-0 `}>
                <Avatar >
                  {user?.avatar ? (
                    <AvatarImage
                      src={user.avatar.url}
                      alt={user?.username ?? "User"}
                    />
                  ) : (
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  )}
                </Avatar>
                <span
                  className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 hidden"}`}
                >
                  {user?.username}
                </span>
              </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? "top" : "right"}
              align={isMobile ? "end" : "center"}
              className="w-40 "
            >
              <DropdownMenuItem
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
              >
                <Edit />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setIsLoginModalOpen(true);
                }}
              >
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Keep dialogs mounted outside the dropdown content so they open on first click */}
          <EditUserDialog
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
          />
          <LogoutAlertDialog
            isLoginModalOpen={isLoginModalOpen}
            setIsLoginModalOpen={setIsLoginModalOpen}
          />
        </SidebarFooter>
      </Sidebar>

      {/* Main content + trigger */}
      <SidebarInset>
        <SidebarTrigger className="sticky top-4" />
      </SidebarInset>
    </>
  );
}
