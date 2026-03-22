import { motion, AnimatePresence } from 'motion/react';
import { Mic, Paperclip, Sparkles, CheckCircle2, Loader2, Heart, Share, Bookmark, Copy, Upload, Twitter, Facebook, Link, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

type HomePhase = 'input' | 'processing' | 'result';

export function Home() {
  const [phase, setPhase] = useState<HomePhase>('input');

  const handleTransmit = () => {
    setPhase('processing');
    // Simulate processing time
    setTimeout(() => {
      setPhase('result');
    }, 4000);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-start w-full relative pt-8 md:pt-16">
      <AnimatePresence mode="wait">
        {phase === 'input' && <InputPhase key="input" onTransmit={handleTransmit} />}
        {phase === 'processing' && <ProcessingPhase key="processing" />}
        {phase === 'result' && <ResultPhase key="result" />}
      </AnimatePresence>
    </div>
  );
}

function InputPhase({ onTransmit }: { onTransmit: () => void }) {
  const trendingVibes = [
    { title: 'Main Character Fatigue', pulse: '3.4M', metric: '+284%', metricColor: 'text-secondary' },
    { title: 'Villain Arc', pulse: '1.8M', metric: '+142%', metricColor: 'text-secondary' },
    { title: 'Soft Life Crisis', pulse: '942K', metric: '+88%', metricColor: 'text-tertiary-dim' },
  ];

  const newVibes = [
    { title: 'Digital Nomad Zen', pulse: '12K', metric: 'Just now', metricColor: 'text-primary-dim' },
    { title: 'Neo-Pastoralism', pulse: '8.4K', metric: '2m ago', metricColor: 'text-primary-dim' },
    { title: 'Data Nihilism', pulse: '5.1K', metric: '15m ago', metricColor: 'text-primary-dim' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex flex-col items-center text-center relative z-10 pb-20"
    >
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 vibe-pulse bg-secondary-container rounded-full mix-blend-screen -z-10"></div>
        
        <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-12 relative">
          <div className="absolute inset-0 rounded-full border border-secondary/30 animate-ping opacity-20"></div>
          <Sparkles className="text-secondary opacity-80" size={32} />
        </div>

        <h1 className="text-5xl md:text-6xl font-headline italic mb-6">
          What is the current <span className="text-secondary">frequency</span> of your soul?
        </h1>
        <p className="font-body text-on-surface-variant mb-12 text-lg">
          Speak freely. Let the resonance of your thoughts guide the engine.
        </p>

        <div className="w-full glass-card rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <textarea 
            placeholder="Inhale. Type. Exhale..."
            className="w-full bg-transparent border-none outline-none resize-none h-32 text-lg placeholder:text-on-surface-variant/50"
          />
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex gap-4 text-on-surface-variant">
              <button className="hover:text-primary transition-colors"><Mic size={20} /></button>
              <button className="hover:text-primary transition-colors"><Paperclip size={20} /></button>
            </div>
            <button 
              onClick={onTransmit}
              className="bg-primary text-on-primary-container px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(216,230,252,0.3)]"
            >
              Transmit <Sparkles size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-12 mb-24">
          {['Feeling nostalgic', 'Electric chaos', 'Deep focus'].map(tag => (
            <button key={tag} className="px-4 py-2 rounded-full border border-white/10 text-sm text-on-surface-variant hover:bg-white/5 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Trending & New Vibes Sections */}
      <div className="w-full max-w-5xl space-y-16 text-left">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline italic text-on-surface">Trending Vibes</h2>
            <span className="text-xs font-label uppercase tracking-widest text-secondary">Top 3</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingVibes.map((vibe, i) => (
              <motion.div 
                key={vibe.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
              >
                <h3 className="font-headline italic text-xl mb-3 group-hover:text-primary transition-colors">{vibe.title}</h3>
                <div className="flex justify-between items-center text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  <span>{vibe.pulse} Pulse</span>
                  <span className={vibe.metricColor}>{vibe.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline italic text-on-surface">New Vibes</h2>
            <span className="text-xs font-label uppercase tracking-widest text-primary-dim">Just In</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newVibes.map((vibe, i) => (
              <motion.div 
                key={vibe.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (0.1 * i) }}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
              >
                <h3 className="font-headline italic text-xl mb-3 group-hover:text-primary transition-colors">{vibe.title}</h3>
                <div className="flex justify-between items-center text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  <span>{vibe.pulse} Pulse</span>
                  <span className={vibe.metricColor}>{vibe.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function ProcessingPhase() {
  const steps = [
    "Scanning Reddit for sentiment...",
    "Clustering emotional signals...",
    "Extracting raw human phrases...",
    "Synthesizing AI Remix..."
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl flex flex-col items-center relative z-10"
    >
      <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 vibe-pulse bg-primary/20 rounded-full mix-blend-screen -z-10"></div>
      
      <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mb-16 shadow-[0_0_50px_rgba(216,230,252,0.4)]">
        <Sparkles className="text-on-primary-container" size={40} />
      </div>

      <h2 className="text-4xl md:text-5xl font-headline italic text-center mb-8">
        "Deeply melancholy yet hopeful at dawn"
      </h2>
      
      <p className="font-label text-xs uppercase tracking-widest text-primary-container mb-12">
        Synthesizing emotional resonance...
      </p>

      <div className="w-full glass-card rounded-2xl p-8 border border-white/5 relative">
        {/* Decorative floating quote */}
        <div className="absolute -right-32 top-0 glass-card p-4 rounded-xl border border-secondary/20 rotate-3 max-w-[200px] hidden lg:block">
          <p className="font-headline italic text-secondary text-sm">"There is a ghost in the syntax of these threads."</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="text-secondary" size={16} />
                  ) : isActive ? (
                    <Loader2 className="text-secondary animate-spin" size={16} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20" />
                  )}
                </div>
                <div>
                  <p className={`text-xs font-mono mb-1 ${isCompleted || isActive ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {isCompleted ? '04:22:18MS' : isActive ? 'PROCESSING' : 'PENDING'}
                  </p>
                  <p className={`text-lg ${isPending ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                    {step}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ResultPhase() {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = "My soul's frequency is 'Villain Arc (Self-Care Edition)'. What's yours? #VibeCheckAI";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl flex flex-col items-center relative z-10 pt-10"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] vibe-pulse bg-secondary-container/10 rounded-full -z-10"></div>

      <div className="text-center mb-16">
        <span className="px-4 py-1 rounded-full border border-secondary/30 text-secondary text-xs font-label uppercase tracking-widest mb-8 inline-block">
          Current Frequency
        </span>
        <h1 className="text-6xl md:text-8xl font-headline italic mb-6">
          Villain Arc <span className="text-on-surface-variant text-4xl md:text-6xl">(Self-Care Edition)</span>
        </h1>
        <p className="text-2xl font-headline italic text-primary-dim mb-8">
          "Silence is the loudest way to say I'm choosing myself."
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/10"></div>
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Sentient Glow Engine</span>
          <div className="h-px w-12 bg-white/10"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
        <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
          <div>
            <Heart className="text-secondary mb-6" fill="currentColor" />
            <h3 className="text-2xl font-headline italic mb-2">The Pulse</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              A collective shift in boundaries is emerging worldwide.
            </p>
          </div>
          <div className="mt-12">
            <p className="text-4xl font-bold mb-2">42.5k</p>
            <div className="flex items-center gap-2 text-xs font-label uppercase tracking-widest text-primary-container">
              <span>People feeling this</span>
              <span className="bg-tertiary-dim/20 text-tertiary-dim px-2 py-0.5 rounded">~12%</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 glass-card rounded-2xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-headline italic">Echo Chamber</h3>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Live Consensus</span>
          </div>
          
          <div className="space-y-6 border-l-2 border-white/10 pl-6">
            <p className="text-lg font-headline italic text-primary-dim">
              "I'm just tired of being the 'nice' one. The peace I found in saying 'no' is terrifyingly beautiful."
            </p>
            <p className="text-lg font-headline italic text-primary-dim">
              "Finally setting boundaries and it feels... strange but good. Like I'm meeting myself for the first time."
            </p>
            <p className="text-lg font-headline italic text-primary-dim">
              "The arc isn't about hurting others; it's about refusing to hurt myself anymore."
            </p>
          </div>
        </div>
      </div>

      <div className="w-full glass-card rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Sparkles className="text-secondary" size={20} />
          </div>
          <div>
            <h4 className="font-headline italic text-xl">Amplify the Vibe</h4>
            <p className="text-sm text-on-surface-variant">Let the collective know where you stand.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary-container px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(216,230,252,0.2)]">
            Share this Vibe
          </button>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleTwitterShare}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[#1DA1F2] transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter size={16} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleFacebookShare}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[#4267B2] transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook size={16} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface-variant transition-colors relative"
              aria-label="Copy Link"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check size={16} className="text-secondary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="link"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Link size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
