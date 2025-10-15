'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hand, LayoutDashboard, Bot, Video } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Tablero', icon: LayoutDashboard },
  { href: '/learn', label: 'Aprender', icon: Hand },
  { href: '/practice', label: 'Práctica', icon: Video },
  { href: '/chatbot', label: 'Chatbot', icon: Bot },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Hand className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground group-data-[collapsible=icon]:hidden">
            SignFriend
          </span>
        </Link>
      </SidebarHeader>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
              className={cn(pathname === item.href && 'bg-primary/10 text-primary hover:text-primary')}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}
