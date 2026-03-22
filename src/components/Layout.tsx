import { Bell, User, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentTab: string;
  setTab: (tab: string) => void;
}

export function Layout({ children, currentTab, setTab }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary/30 flex flex-col">
      <nav className="bg-background/80 backdrop-blur-xl fixed top-0 z-50 flex justify-between items-center w-full px-8 py-4">
        <div className="text-2xl font-headline text-primary tracking-tighter italic cursor-pointer" onClick={() => setTab('home')}>
          VibeCheck AI
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-headline italic tracking-wide">
          {['home', 'most-vibey', 'records'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`transition-colors duration-300 uppercase text-sm ${
                currentTab === tab
                  ? 'text-primary border-b border-primary/30 pb-1'
                  : 'text-primary-container hover:text-primary'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 text-primary">
          {currentTab === 'records' && (
             <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200">
               <Search size={20} />
             </button>
          )}
          {currentTab !== 'records' && (
            <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200">
              <Bell size={20} />
            </button>
          )}
          <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200 bg-white/5">
            <User size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-b from-surface-container to-transparent h-px w-full"></div>
      </nav>

      <main className="flex-grow pt-28 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
