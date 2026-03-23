import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Music, Twitter, Facebook, Link, Check, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { VibeImageTemplate } from './VibeImageTemplate';

export function VibeModal({ vibe, onClose }: { vibe: any, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [pulseCount, setPulseCount] = useState(vibe?.pulseCount || 0);
  const [likes, setLikes] = useState(vibe?.likes || 0);
  const [hasReacted, setHasReacted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleReact = async () => {
    if (hasReacted) return;
    const userId = localStorage.getItem('vibecheck_userId');
    if (!userId) return;
    setLikes((l: number) => l + 1);
    setHasReacted(true);
    fetch('/api/vibes/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vibeId: vibe.id, userId, reactionType: 'heart' })
    }).catch(() => { setLikes((l: number) => l - 1); setHasReacted(false); });
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!vibe) return null;

  const shareUrl = window.location.origin; // In a real app, this might link to a specific vibe ID
  const shareText = `My soul's frequency is '${vibe.vibeLabel}'. What's yours? #VibeCheckAI`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadImage = async () => {
    if (!templateRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(templateRef.current, {
        cacheBust: true,
        backgroundColor: '#0A0A0B',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `vibecheck-${vibe.vibeLabel.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
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

  // Safe checks for arrays
  const voices = Array.isArray(vibe.realVoices) ? vibe.realVoices : 
                 (typeof vibe.realVoices === 'string' ? JSON.parse(vibe.realVoices) : []);
  const music = Array.isArray(vibe.musicRecommendations) ? vibe.musicRecommendations : 
                (typeof vibe.musicRecommendations === 'string' ? JSON.parse(vibe.musicRecommendations) : []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-0">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />
        
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto glass-card rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl z-10 p-4 sm:p-8 md:p-12 custom-scrollbar"
          >
          <VibeImageTemplate vibe={vibe} ref={templateRef} />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-on-surface transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-12 mt-4">
            <span className="px-4 py-1 rounded-full border border-secondary/30 text-secondary text-xs font-label uppercase tracking-widest mb-6 inline-block">
              Recorded Frequency
            </span>
            <h2 className="text-2xl sm:text-5xl md:text-7xl font-headline italic mb-3 leading-tight">
              {vibe.vibeLabel}
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-headline italic text-primary-dim px-4">
              "{vibe.aiRemix}"
            </p>

            {vibe.supportMessage && (
              <div className="mt-8 relative max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-secondary/10 border border-secondary/20 backdrop-blur-md text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-surface-container-highest border border-secondary/20 rounded-full text-[10px] font-label uppercase tracking-widest text-secondary flex items-center gap-1 shadow-lg">
                   <Sparkles size={10} /> Message of Resonance
                </div>
                <p className="font-body text-sm sm:text-base text-secondary-dim leading-relaxed text-center">
                   {vibe.supportMessage}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between bg-surface-container-low/50 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
              <div>
                <button 
                  onClick={handleReact}
                  className={`p-3 rounded-full mb-4 transition-all ${hasReacted ? 'bg-secondary/20 text-secondary scale-110' : 'bg-white/5 text-outline hover:text-secondary hover:bg-secondary/10 hover:scale-105'}`}
                  aria-label="React to this vibe"
                >
                  <Heart className={hasReacted ? "fill-secondary" : ""} size={24} />
                </button>
                <h3 className="text-lg md:text-xl font-headline italic mb-2 relative z-10">The Pulse</h3>
              </div>
              <div className="mt-4 md:mt-6 relative z-10">
                <div className="flex items-end gap-2 md:gap-3 mb-2">
                  <p className="text-2xl md:text-4xl font-bold text-secondary tracking-tight">{likes.toLocaleString()}</p>
                  <p className="text-[9px] md:text-[10px] font-label uppercase tracking-widest text-secondary-dim pb-1 md:pb-1.5">Real Resonance</p>
                </div>
                <div className="pt-3 md:pt-4 border-t border-white/10 mt-3 md:mt-4">
                  <p className="text-lg md:text-2xl font-bold mb-1 tracking-tight text-on-surface-variant">{pulseCount.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-primary-container">
                    <span>AI Global Pulse</span>
                    <span className="bg-tertiary-dim/20 text-tertiary-dim px-2 py-0.5 rounded">{vibe.growthPercentage}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-white/5 bg-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-headline italic">Echo Chamber</h3>
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Archived Consensus</span>
              </div>
              
              <div className="space-y-4">
                {voices.map((voice: string, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 relative hover:bg-white/10 transition-colors">
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                       <span className="text-[10px] text-primary font-bold">@anon</span>
                    </div>
                    <p className="text-xs md:text-sm font-body text-on-surface-variant ml-10 leading-relaxed mb-3">
                      {voice}
                    </p>
                    <div className="flex gap-4 ml-10">
                       <button className="flex items-center gap-1.5 text-[10px] text-outline hover:text-secondary transition-colors"><Heart size={12} /> {Math.floor(Math.random()*150) + 10} </button>
                       <button className="flex items-center gap-1.5 text-[10px] text-outline hover:text-primary transition-colors"><Twitter size={12} /> Share </button>
                    </div>
                  </div>
                ))}
                {voices.length === 0 && <p className="text-sm text-on-surface-variant italic">No echoes recorded.</p>}
              </div>
            </div>
          </div>

          <div className="w-full mb-8 glass-card rounded-2xl p-6 border border-white/5 bg-surface-container-low/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-headline italic">Sonic Resonance</h3>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Recommended Tracks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {music.map((track: any, idx: number) => (
                <a 
                  key={idx} 
                  href={`https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/5 p-3 rounded-xl hover:bg-secondary/10 hover:border-secondary/30 border border-transparent transition-all group"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(253,119,196,0.1)] group-hover:shadow-[0_0_20px_rgba(253,119,196,0.2)]">
                     <Music size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-headline italic text-on-surface text-sm sm:text-base leading-tight truncate group-hover:text-secondary transition-colors">{track.title}</p>
                    <p className="text-[10px] text-on-surface-variant font-body truncate">{track.artist}</p>
                  </div>
                </a>
              ))}
              {music.length === 0 && <p className="text-sm text-on-surface-variant italic col-span-3">No tracks found for this frequency.</p>}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8 pt-6 border-t border-white/10">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadImage}
              disabled={isExporting}
              className={`h-10 md:h-12 px-4 md:px-6 rounded-full border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 text-on-surface transition-colors ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? <Loader2 size={16} className="animate-spin text-secondary" /> : <ImageIcon size={16} className="text-secondary" />}
              <span className="text-xs md:text-sm font-semibold">Save Card</span>
            </motion.button>
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleTwitterShare}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] text-on-surface-variant transition-colors"
              >
                <Twitter size={18} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleFacebookShare}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#4267B2]/20 hover:text-[#4267B2] text-on-surface-variant transition-colors"
              >
                <Facebook size={18} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-on-surface-variant transition-colors relative"
              >
                {copied ? <Check size={18} className="text-secondary" /> : <Link size={18} />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
