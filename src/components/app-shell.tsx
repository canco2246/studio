"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  PackageSearch, 
  ScanLine, 
  Settings, 
  Menu,
  Tags,
  Search,
  Plus
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Tags },
  { name: 'Scan Asset', href: '/scan', icon: ScanLine },
  { name: 'Advanced Search', href: '/search', icon: Search },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-sm">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <div className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <ScanLine className="size-6" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-lg leading-none text-primary">TagSync Pro</span>
            <span className="text-xs text-muted-foreground font-medium">RFID Inventory System</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 uppercase tracking-widest text-[10px] font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      tooltip={item.name}
                      className="transition-all duration-200"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
          <div className="bg-accent/10 rounded-lg p-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-primary">Need Help?</p>
            <p className="text-[10px] text-muted-foreground">Check the documentation for IDT107 hardware integration.</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border/40 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
              <h1 className="text-xl font-headline font-semibold text-foreground">
                {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Quick tag search..." 
                className="bg-muted/50 border-none rounded-full pl-9 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <Link href="/scan" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="size-4" />
              <span>New Entry</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}