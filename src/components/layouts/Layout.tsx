import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/appLayoutLogic"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full  mt-10">
        {children}
      </main>
    </SidebarProvider>
  )
}