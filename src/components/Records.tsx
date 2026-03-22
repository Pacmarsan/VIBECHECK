import { motion } from 'motion/react';
import { Search, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { VibeModal } from './VibeModal';

export function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<any>(null);

  useEffect(() => {
    fetchVibes();
  }, []);

  const fetchVibes = () => {
    fetch('/api/vibes?limit=50')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error(err));
  };

  const userId = localStorage.getItem('vibecheck_userId');

  const handleReact = async (vibeId: string) => {
    if (!userId) return;
    try {
      const res = await fetch('/api/vibes/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibeId, userId, reactionType: 'heart' })
      });
      if (res.ok) {
        // Optimistically update
        setRecords(prev => prev.map(r => 
          r.id === vibeId ? { ...r, pulseCount: (r.pulseCount || 0) + 1 } : r
        ));
      }
    } catch (e) {
      console.error("Reaction failed", e);
    }
  };
  
  const filteredRecords = records.filter(r => {
    if (filter === 'Personal' && r.userId !== userId) return false;
    if (filter === 'Global' && r.userId === userId) return false;
    if (search && !r.vibeLabel.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center pt-10"
    >
      <h1 className="text-6xl md:text-8xl font-headline mb-12">RECORDS</h1>
      
      <div className="w-full max-w-2xl relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search past vibes..." 
          className="w-full bg-surface-container-high border border-white/10 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex gap-6 mb-16">
        <button onClick={() => setFilter('All')} className={`px-6 py-2 rounded-full text-sm transition-colors ${filter === 'All' ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>All</button>
        <button onClick={() => setFilter('Personal')} className={`px-6 py-2 rounded-full text-sm transition-colors ${filter === 'Personal' ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>Personal</button>
        <button onClick={() => setFilter('Global')} className={`px-6 py-2 rounded-full text-sm transition-colors ${filter === 'Global' ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}>Global</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {filteredRecords.map((record, i) => (
          <motion.div 
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedVibe(record)}
            className="glass-card rounded-2xl p-4 border border-secondary/20 hover:border-secondary/50 transition-colors cursor-pointer group shadow-[0_0_15px_rgba(253,119,196,0.1)] hover:shadow-[0_0_25px_rgba(253,119,196,0.2)] flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <h3 className="font-headline italic text-2xl mb-1">{record.vibeLabel}</h3>
              <p className="text-xs text-on-surface-variant mb-3">{new Date(record.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-4">
              <button 
                onClick={(e) => { e.stopPropagation(); handleReact(record.id); }}
                className="flex items-center gap-1.5 hover:text-secondary transition-colors z-10"
              >
                <Heart size={14} className={record.userId === userId ? 'text-secondary' : 'text-outline-variant'} />
                <span>{(record.pulseCount || 0).toLocaleString()}</span>
              </button>
              <span className="text-primary-dim">{record.growthPercentage}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedVibe && <VibeModal vibe={selectedVibe} onClose={() => setSelectedVibe(null)} />}
    </motion.div>
  );
}
