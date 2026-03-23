import { Bell, User, Search, Home as HomeIcon, Zap, Layers } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentTab: string;
  setTab: (tab: string) => void;
}

export function Layout({ children, currentTab, setTab }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-secondary/30 flex flex-col">
      <nav className="bg-background/80 backdrop-blur-lg md:backdrop-blur-xl fixed top-0 z-50 flex justify-between items-center w-full px-4 md:px-8 py-4 border-b border-white/5">
        <div className="text-xl md:text-2xl font-headline text-primary tracking-tighter italic cursor-pointer" onClick={() => setTab('home')}>
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

        <div className="flex items-center gap-3 md:gap-6 text-primary">
          {currentTab === 'records' && (
             <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200">
               <Search size={18} className="md:w-5 md:h-5" />
             </button>
          )}
          {currentTab !== 'records' && (
            <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200">
              <Bell size={18} className="md:w-5 md:h-5" />
            </button>
          )}
          <button className="hover:bg-white/5 transition-all p-2 rounded-full active:scale-95 duration-200 bg-white/5">
            <User size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-lg z-50 border-t border-white/5 px-6 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'home' ? 'text-secondary' : 'text-on-surface-variant'}`}
        >
          <HomeIcon size={20} />
          <span className="text-[10px] font-label uppercase tracking-widest">Home</span>
        </button>
        <button 
          onClick={() => setTab('most-vibey')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'most-vibey' ? 'text-secondary' : 'text-on-surface-variant'}`}
        >
          <Zap size={20} />
          <span className="text-[10px] font-label uppercase tracking-widest">Most Vibey</span>
        </button>
        <button 
          onClick={() => setTab('records')}
          className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'records' ? 'text-secondary' : 'text-on-surface-variant'}`}
        >
          <Layers size={20} />
          <span className="text-[10px] font-label uppercase tracking-widest">Records</span>
        </button>
      </nav>

      <main className="flex-grow pt-20 md:pt-28 pb-28 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
