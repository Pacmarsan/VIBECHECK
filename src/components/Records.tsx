import { motion } from 'motion/react';
import { Search, Heart } from 'lucide-react';

export function Records() {
  const records = [
    { title: 'Villain Arc', date: 'Oct 28, 2024', pulse: '42.5k' },
    { title: 'Soft Girl Autumn', date: 'Oct 28, 2024', pulse: '88.1k' },
    { title: 'Techno-Optimism', date: 'Oct 26, 2024', pulse: '88.1k' },
    { title: 'Digital Nomad Zen', date: 'Oct 28, 2024', pulse: '88.1k' },
    { title: 'Villain Arc', date: 'Oct 26, 2024', pulse: '42.5k' },
    { title: 'Soft Girl Autumn', date: 'Oct 28, 2024', pulse: '88.1k' },
    { title: 'Techno-Optimism', date: 'Oct 26, 2024', pulse: '82.3k' },
    { title: 'Digital Nomad Zen', date: 'Oct 28, 2024', pulse: '88.1k' },
  ];

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
          placeholder="Search past vibes..." 
          className="w-full bg-surface-container-high border border-white/10 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex gap-6 mb-16">
        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface text-sm">All</button>
        <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors text-sm">Personal</button>
        <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors text-sm">Global</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {records.map((record, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4 border border-secondary/20 hover:border-secondary/50 transition-colors cursor-pointer group shadow-[0_0_15px_rgba(253,119,196,0.1)] hover:shadow-[0_0_25px_rgba(253,119,196,0.2)]"
          >
            <div className="w-full aspect-[4/3] rounded-xl holo-bg mb-4 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="font-headline italic text-2xl mb-1">{record.title}</h3>
            <p className="text-xs text-on-surface-variant mb-3">{record.date}</p>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Heart size={14} />
              <span>{record.pulse} Pulse</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
