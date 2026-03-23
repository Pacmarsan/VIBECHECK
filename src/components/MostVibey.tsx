import { motion } from 'motion/react';
import { Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { VibeModal } from './VibeModal';

export function MostVibey() {
  const [vibes, setVibes] = useState<any[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<any>(null);

  useEffect(() => {
    fetch('/api/vibes?limit=20')
      .then(res => res.json())
      .then(data => {
        // Sort by resonance for "Most Vibey"
        const sorted = [...data].sort((a, b) => (b.pulseCount || 0) - (a.pulseCount || 0));
        setVibes(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  const rank1 = vibes[0] || { vibeLabel: 'Void', aiRemix: 'Nothing here.', pulseCount: 0, growthPercentage: '0%' };
  const rank2 = vibes[1] || { vibeLabel: 'Void', aiRemix: 'Nothing here.', pulseCount: 0, growthPercentage: '0%' };
  const rank3 = vibes[2] || { vibeLabel: 'Void', aiRemix: 'Nothing here.', pulseCount: 0, growthPercentage: '0%' };
  const theRest = vibes.slice(3, 8);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <header className="mb-12 md:mb-24 flex flex-col md:flex-row items-baseline gap-4">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-headline italic text-on-surface leading-tight tracking-tight">
          The Collective Pulse
        </h1>
        <p className="font-body text-primary-container/80 text-xs md:text-base uppercase tracking-[0.2em]">
          Real-time resonance ranking
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        {/* Rank 2 */}
        <div className="order-2 lg:order-1 flex flex-col justify-end">
          <div className="glass-card rounded-xl p-5 sm:p-8 border border-outline-variant/15 relative overflow-hidden group hover:bg-surface-variant/50 transition-all duration-500 cursor-pointer" onClick={() => rank2.vibeLabel !== 'Void' && setSelectedVibe(rank2)}>
            <div className="absolute -top-16 -right-16 w-32 h-32 md:-top-20 md:-right-20 md:w-48 md:h-48 vibe-pulse bg-secondary-container rounded-full"></div>
            <div className="relative z-10">
              <span className="font-headline text-2xl md:text-4xl italic text-secondary-dim opacity-50 block mb-2 md:mb-4">02</span>
              <h3 className="font-headline text-xl md:text-3xl mb-1 md:mb-2 text-on-surface line-clamp-2">{rank2.vibeLabel}</h3>
              <p className="font-body text-on-surface-variant text-xs md:text-sm mb-4 md:mb-6 leading-relaxed italic line-clamp-3">"{rank2.aiRemix}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] md:text-xs font-label uppercase tracking-widest text-primary-container mb-1">Pulse</p>
                  <p className="text-lg md:text-2xl font-body font-bold text-on-surface">{(rank2.pulseCount || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] md:text-xs font-label uppercase tracking-widest text-secondary mb-1">Growth</p>
                  <p className="text-base font-body font-semibold text-secondary">{rank2.growthPercentage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 1 */}
        <div className="order-1 lg:order-2 flex flex-col justify-end">
          <div className="glass-card rounded-xl p-6 sm:p-10 border border-primary/20 relative overflow-hidden group hover:bg-surface-variant/60 transition-all duration-700 sm:min-h-[420px] flex flex-col justify-between cursor-pointer" onClick={() => rank1.vibeLabel !== 'Void' && setSelectedVibe(rank1)}>
            <div className="absolute -top-24 -left-24 w-72 h-72 vibe-pulse bg-primary rounded-full animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 vibe-pulse bg-secondary-container rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <span className="font-headline text-4xl sm:text-6xl italic text-primary block leading-none">01</span>
                <Star className="text-primary scale-110 sm:scale-150" fill="currentColor" />
              </div>
              <h3 className="font-headline text-2xl sm:text-5xl mb-3 md:mb-4 text-on-surface leading-none line-clamp-2">{rank1.vibeLabel}</h3>
              <p className="font-body text-primary-fixed-dim text-sm sm:text-lg mb-6 md:mb-8 italic line-clamp-3">"{rank1.aiRemix}"</p>
            </div>
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-black/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-[10px] font-label uppercase tracking-widest text-primary-container mb-1 leading-tight">Pulse Resonance</p>
                  <p className="text-lg sm:text-3xl font-body font-bold text-primary">{(rank1.pulseCount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-black/20 p-3 sm:p-4 rounded-lg">
                  <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-1">Velocity</p>
                  <p className="text-lg sm:text-3xl font-body font-bold text-secondary">{rank1.growthPercentage}</p>
                </div>
              </div>
              <button className="w-full py-3 md:py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-transform active:scale-95">
                Explore Vibe
              </button>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="order-3 lg:order-3 flex flex-col justify-end">
          <div className="glass-card rounded-xl p-5 sm:p-8 border border-outline-variant/15 relative overflow-hidden group hover:bg-surface-variant/50 transition-all duration-500 cursor-pointer" onClick={() => rank3.vibeLabel !== 'Void' && setSelectedVibe(rank3)}>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 md:-bottom-20 md:-left-20 md:w-48 md:h-48 vibe-pulse bg-tertiary-container rounded-full"></div>
            <div className="relative z-10">
              <span className="font-headline text-2xl md:text-4xl italic text-tertiary-dim opacity-50 block mb-2 md:mb-4">03</span>
              <h3 className="font-headline text-xl md:text-3xl mb-1 md:mb-2 text-on-surface line-clamp-2">{rank3.vibeLabel}</h3>
              <p className="font-body text-on-surface-variant text-xs md:text-sm mb-4 md:mb-6 leading-relaxed italic line-clamp-3">"{rank3.aiRemix}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] md:text-xs font-label uppercase tracking-widest text-primary-container mb-1">Pulse</p>
                  <p className="text-lg md:text-2xl font-body font-bold text-on-surface">{(rank3.pulseCount || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] md:text-xs font-label uppercase tracking-widest text-tertiary mb-1">Growth</p>
                  <p className="text-base font-body font-semibold text-tertiary">{rank3.growthPercentage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-32">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
          <h2 className="font-headline text-xl md:text-3xl text-on-surface italic">The Trending Ethers</h2>
          <div className="flex gap-4">
            <button className="text-xs font-label tracking-widest text-secondary uppercase hover:text-secondary-dim transition-colors">By Resonance</button>
            <span className="text-outline/30">|</span>
            <button className="text-xs font-label tracking-widest text-on-surface-variant uppercase hover:text-on-surface transition-colors">By Velocity</button>
          </div>
        </div>
        
        <div className="space-y-4">
          {theRest.length === 0 && <p className="text-outline-variant italic">The ethers are quiet. Generate more vibes to populate the rankings.</p>}
          {theRest.map((v: any, i: number) => (
            <ListItem 
              key={v.id} 
              rank={`0${i + 4}`} 
              title={v.vibeLabel} 
              desc={`"${v.aiRemix}"`} 
              resonance={(v.pulseCount || 0).toLocaleString()} 
              trend={v.growthPercentage} 
              trendColor="text-secondary-dim" 
              onClick={() => setSelectedVibe(v)}
            />
          ))}
        </div>
      </section>



      {selectedVibe && <VibeModal vibe={selectedVibe} onClose={() => setSelectedVibe(null)} />}
    </motion.div>
  );
}

function ListItem({ rank, title, desc, resonance, trend, trendColor, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl gap-6 md:gap-0 cursor-pointer">
      <div className="flex items-center gap-8 flex-1">
        <span className="font-headline text-2xl text-outline italic w-8">{rank}</span>
        <div>
          <h4 className="font-headline text-lg sm:text-xl text-on-surface">{title}</h4>
          <p className="font-body text-on-surface-variant text-xs sm:text-sm italic">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-12 text-right">
        <div className="hidden sm:block">
          <p className="text-[10px] font-label uppercase tracking-widest text-outline-variant mb-1">Resonance</p>
          <p className="font-body font-bold text-primary-fixed-dim">{resonance}</p>
        </div>
        <div>
          <p className="text-[10px] font-label uppercase tracking-widest text-outline-variant mb-1">Trend</p>
          <p className={`font-body font-bold ${trendColor}`}>{trend}</p>
        </div>
        <button className="flex items-center justify-center p-2 rounded-full border border-outline-variant/30 hover:bg-primary/10 transition-colors">
          <ArrowRight className="text-primary-dim" size={20} />
        </button>
      </div>
    </div>
  );
}
