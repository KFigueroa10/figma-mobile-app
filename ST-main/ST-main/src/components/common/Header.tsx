'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const pathToTitle: { [key: string]: string } = {
  '/dashboard': 'Tablero',
  '/learn': 'Aprender',
  '/practice': 'Práctica',
  '/chatbot': 'Chatbot',
};

export function Header() {
  const pathname = usePathname();
  const title = pathToTitle[pathname] || 'SignFriend';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 text-xl font-semibold font-headline">{title}</h1>
      <Avatar>
        <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User avatar" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    </header>
  );
}
