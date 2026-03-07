"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Brain, FileText, LayoutDashboard, LogOut, School, Settings, Wrench, Users, UserCog } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/app/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Alunos", url: "/alunos", icon: Users },
  { title: "Turmas", url: "/turmas", icon: School },
  { title: "Disciplinas", url: "/disciplinas", icon: BookOpen },
  /* { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Intervenções", url: "/intervencoes", icon: UserCog },
  { title: "Modelo Preditivo", url: "/modeloPreditivo", icon: Brain },
  { title: "Configurações", url: "/configuracoes", icon: Settings }, */
  { title: "Relatórios", url: "/404", icon: FileText },
  { title: "Intervenções", url: "/404", icon: UserCog },
  { title: "Modelo Preditivo", url: "/404", icon: Brain },
  { title: "Configurações", url: "/404", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.url}
                        className={`hover:bg-sidebar-accent ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : ""
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
