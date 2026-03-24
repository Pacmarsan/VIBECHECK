import { motion, AnimatePresence } from 'motion/react';
import { Mic, Paperclip, Sparkles, ArrowRight, Loader2, CheckCircle2, Heart, Download, Share2, Twitter, Facebook, Link, Check, Music, Image as ImageIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { VibeModal } from './VibeModal';
import { VibeImageTemplate } from './VibeImageTemplate';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

// --- Helper Components for Premium Feel ---

function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      let scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (frame > i * 2 + 10) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplay(scrambled);
      if (frame > text.length * 2 + 20) clearInterval(interval);
      frame++;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <>{display}</>;
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

type HomePhase = 'input' | 'processing' | 'result';

export function Home({ setTab }: { setTab?: (tab: string) => void }) {
  const [phase, setPhase] = useState<HomePhase>('input');
  const [vibeResult, setVibeResult] = useState<any>(null);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('vibecheck_userId')) {
      localStorage.setItem('vibecheck_userId', Math.random().toString(36).substring(2, 15));
    }
  }, []);

  const handleTransmit = async (input: string) => {
    setCurrentInput(input);
    setPhase('processing');
    try {
      const userId = localStorage.getItem('vibecheck_userId') || 'anon';
      const res = await fetch('/api/vibecheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, userId })
      });
      const data = await res.json();
      if (data && data.error) {
        throw new Error(data.error);
      }
      setVibeResult(data);
    } catch (err) {
      console.error(err);
      setVibeResult({
        vibeLabel: "Void Signal", pulseCount: 0, growthPercentage: "0%",
        realVoices: ["Connection failed."], aiRemix: "The server is offline."
      });
    } finally {
      setPhase('result');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-start w-full relative pt-8 md:pt-16">
      <AnimatePresence mode="wait">
        {phase === 'input' && <InputPhase key="input" onTransmit={handleTransmit} setTab={setTab} />}
        {phase === 'processing' && <ProcessingPhase key="processing" input={currentInput} />}
        {phase === 'result' && vibeResult && <ResultPhase key="result" result={vibeResult} />}
      </AnimatePresence>
    </div>
  );
}

function InputPhase({ onTransmit, setTab }: { onTransmit: (text: string) => Promise<void> | void; setTab?: (tab: string) => void; key?: React.Key }) {
  const [text, setText] = useState('');
  const [allVibes, setAllVibes] = useState<any[]>([]);
  const [trendingVibes, setTrendingVibes] = useState<any[]>([]);
  const [newVibes, setNewVibes] = useState<any[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'resonance' | 'velocity'>('resonance');

  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result?.toString().split(',')[1];
            if (base64data) {
              setIsTranscribing(true);
              try {
                const res = await fetch('/api/vibe/listen', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audioBase64: base64data, mimeType: 'audio/webm' })
                });
                const data = await res.json();
                if (data.text) {
                  setText(prev => {
                    const newText = prev + (prev ? " " : "") + data.text;
                    setTimeout(() => {
                      if (newText.trim()) onTransmit(newText);
                    }, 50);
                    return newText;
                  });
                }
              } catch (err) {
                console.error("Transcription error:", err);
              } finally {
                setIsTranscribing(false);
              }
            }
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access denied or error:", err);
        alert("Microphone access is required to dictate your vibe.");
      }
    }
  };

  useEffect(() => {
    fetch('/api/vibes?limit=100')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllVibes(data);
          setNewVibes([...data].slice(0, 3));
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch(err => console.error("Failed to fetch vibes", err));
  }, []);

  useEffect(() => {
    if (allVibes.length === 0) return;

    let sorted = [...allVibes];
    if (sortBy === 'resonance') {
      sorted.sort((a, b) => 
        ((b.likes || 0) + (b.pulseCount || 0)) - ((a.likes || 0) + (a.pulseCount || 0))
      );
    } else {
      sorted.sort((a, b) => {
        const valA = parseInt(a.growthPercentage?.replace(/[+%]/g, '') || '0');
        const valB = parseInt(b.growthPercentage?.replace(/[+%]/g, '') || '0');
        return valB - valA;
      });
    }
    setTrendingVibes(sorted.slice(0, 3));
  }, [allVibes, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex flex-col items-center text-center relative z-10 pb-20"
    >
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 vibe-pulse bg-secondary-container rounded-full mix-blend-screen -z-10"></div>
        
        <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-12 relative">
          <div className="absolute inset-0 rounded-full border border-secondary/30 animate-ping opacity-20"></div>
          <Sparkles className="text-secondary opacity-80" size={32} />
        </div>

        <h1 className="text-2xl sm:text-5xl md:text-6xl font-headline italic mb-6 leading-tight">
          What is the current <span className="text-secondary">frequency</span> of your soul?
        </h1>
        <p className="font-body text-on-surface-variant mb-12 text-lg">
          Speak freely. Let the resonance of your thoughts guide the engine.
        </p>

        <div className="w-full glass-card rounded-3xl p-4 sm:p-6 border border-white/5 flex flex-col gap-4">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (text.trim()) onTransmit(text);
              }
            }}
            placeholder="Inhale. Type. Exhale..."
            className="w-full bg-transparent border-none outline-none resize-none h-24 md:h-32 text-base md:text-lg placeholder:text-on-surface-variant/50"
          />
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleMicClick} 
                disabled={isTranscribing}
                className={`transition-all flex items-center justify-center w-10 h-10 rounded-full ${
                  isRecording ? 'bg-secondary/20 text-secondary animate-pulse' : 
                  isTranscribing ? 'text-primary' : 'hover:bg-white/5 text-on-surface-variant hover:text-primary'
                }`}
                title={isRecording ? "Stop recording" : "Record vibe"}
              >
                {isTranscribing ? <Loader2 size={20} className="animate-spin" /> : <Mic size={20} />}
              </button>
            </div>
            <Magnetic>
              <button 
                onClick={() => { if(text.trim()) onTransmit(text) }}
                className="bg-primary text-on-primary-container px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-white transition-colors active:scale-95 shadow-[0_0_20px_rgba(216,230,252,0.3)] group"
              >
                Transmit <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8 md:mt-12 mb-16 md:mb-24">
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
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-3xl font-headline italic text-on-surface">The Trending Ethers</h2>
              {setTab && (
                <button 
                  onClick={() => setTab('most-vibey')}
                  className="flex items-center gap-1 pt-1 text-[10px] md:text-xs font-label uppercase tracking-widest text-secondary hover:text-white transition-colors"
                >
                  View More <ArrowRight size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 text-[10px] font-label tracking-widest">
              <button 
                onClick={() => setSortBy('resonance')}
                className={`uppercase transition-colors ${sortBy === 'resonance' ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                By Resonance
              </button>
              <span className="text-white/10">|</span>
              <button 
                onClick={() => setSortBy('velocity')}
                className={`uppercase transition-colors ${sortBy === 'velocity' ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                By Velocity
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingVibes.length === 0 && <p className="text-on-surface-variant italic">No data collected yet. Be the first.</p>}
            {trendingVibes.map((vibe, i) => (
              <VibeCard key={vibe.id} vibe={vibe} delay={0.1 * i} onClick={() => setSelectedVibe(vibe)} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-headline italic text-on-surface">New Vibes</h2>
            <span className="text-xs font-label uppercase tracking-widest text-primary-dim">Just In</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newVibes.length === 0 && <p className="text-on-surface-variant italic">The ethers are quiet.</p>}
            {newVibes.map((vibe, i) => (
              <VibeCard key={vibe.id} vibe={vibe} delay={0.2 + (0.1 * i)} onClick={() => setSelectedVibe(vibe)} />
            ))}
          </div>
        </section>
      </div>

      {selectedVibe && <VibeModal vibe={selectedVibe} onClose={() => setSelectedVibe(null)} />}
    </motion.div>
  );
}

function VibeCard({ vibe, delay, onClick }: { vibe: any; delay: number; onClick: () => void; key?: React.Key }) {
  const [likes, setLikes] = useState(vibe.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) return;
    
    setLikes((prev: number) => prev + 1);
    setHasLiked(true);
    
    const userId = localStorage.getItem('vibecheck_userId') || 'anon';
    try {
      await fetch('/api/vibes/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibeId: vibe.id, userId, reactionType: 'heart' })
      });
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer relative"
    >
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${hasLiked ? 'bg-secondary/20 text-secondary scale-105' : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-on-surface hover:scale-105'}`}
        >
          <Heart size={14} className={hasLiked ? "fill-secondary text-secondary" : ""} />
          {likes > 0 ? likes.toLocaleString() : '0'}
        </button>
      </div>

      <h3 className="font-headline italic text-xl mb-3 pr-16 group-hover:text-primary transition-colors line-clamp-1">{vibe.vibeLabel}</h3>
      <div className="flex justify-between items-center text-xs font-label uppercase tracking-widest text-on-surface-variant">
        <span>{(vibe.pulseCount || 0).toLocaleString()} Pulse</span>
        <span className="text-secondary">{vibe.growthPercentage}</span>
      </div>
    </motion.div>
  );
}

function ProcessingPhase({ input }: { input: string; key?: React.Key }) {
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
      <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 vibe-pulse bg-primary/20 rounded-full mix-blend-screen -z-10"></div>
      
      <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mb-16 shadow-[0_0_50px_rgba(216,230,252,0.4)]">
        <Sparkles className="text-on-primary-container" size={40} />
      </div>

      <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline italic text-center mb-8 line-clamp-2 px-4">
        "{input}"
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
                  <p className={`text-base md:text-lg ${isPending ? 'text-on-surface-variant' : 'text-on-surface'}`}>
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

function ResultPhase({ result }: { result: any; key?: React.Key }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const shareUrl = window.location.href;
  const shareText = `My soul's frequency is '${result.vibeLabel}'. What's yours? #VibeCheckAI`;

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
      link.download = `vibecheck-${result.vibeLabel.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VibeCheck AI',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      handleCopyLink();
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] vibe-pulse bg-secondary-container/10 rounded-full -z-10"></div>

      <VibeImageTemplate vibe={result} ref={templateRef} />

      <div className="text-center mb-16">
        <span className="px-4 py-1 rounded-full border border-secondary/30 text-secondary text-xs font-label uppercase tracking-widest mb-8 inline-block bg-secondary/5 backdrop-blur-sm">
          Current Frequency
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline italic mb-6 text-glow leading-none">
          <ScrambleText text={result.vibeLabel} />
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-headline italic text-primary-dim mb-8 opacity-80 px-4">
          "{result.aiRemix}"
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/10"></div>
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Sentient Glow Engine</span>
          <div className="h-px w-12 bg-white/10"></div>
        </div>

        {result.supportMessage && (
          <div className="mt-12 relative max-w-2xl mx-4 sm:mx-auto p-4 sm:p-6 rounded-2xl bg-secondary/10 border border-secondary/20 backdrop-blur-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1A1A1A] border border-secondary/20 rounded-full text-[10px] font-label uppercase tracking-widest text-secondary flex items-center gap-1 shadow-lg">
               <Sparkles size={10} /> Message of Resonance
            </div>
            <p className="font-body text-sm sm:text-lg text-secondary-dim leading-relaxed text-center">
               {result.supportMessage}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 w-full mb-6">
        {/* The Pulse Card - Bento Row 1 */}
        <div className="md:col-span-3 lg:col-span-4 glass-card rounded-3xl p-5 sm:p-8 border border-white/5 flex flex-col justify-between group hover:border-secondary/30 transition-all bento-inner-shadow">
          <div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="text-secondary md:w-5 md:h-5" fill="currentColor" size={18} />
            </div>
            <h3 className="text-base md:text-2xl font-headline italic mb-2">The Pulse</h3>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              A collective shift in boundaries is emerging worldwide.
            </p>
          </div>
          <div className="mt-6 md:mt-8">
            <p className="text-2xl md:text-5xl font-bold mb-2 tracking-tighter">{(result.pulseCount || 0).toLocaleString()}</p>
            <div className="flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-primary-container">
              <span>People feeling this</span>
              <span className="bg-tertiary-dim/20 text-tertiary-dim px-2 py-0.5 rounded-sm">{result.growthPercentage}</span>
            </div>
          </div>
        </div>

        {/* Echo Chamber - Bento Row 1 */}
        <div className="md:col-span-3 lg:col-span-8 glass-card rounded-3xl p-5 sm:p-8 border border-white/5 group hover:border-primary/20 transition-all bento-inner-shadow">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h3 className="text-base md:text-2xl font-headline italic">Echo Chamber</h3>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant opacity-50">Live Consensus</span>
          </div>
          
          <div className="space-y-4 md:space-y-6 border-l-2 border-primary/10 pl-4 md:pl-8">
            {result.realVoices && result.realVoices.map((voice: string, idx: number) => (
              <p key={idx} className="text-xs md:text-xl font-headline italic text-primary-dim group-hover:text-primary transition-colors leading-relaxed">
                "{voice}"
              </p>
            ))}
          </div>
        </div>

        {/* Sonic Resonance - Bento Row 2 Full Width */}
        <div className="md:col-span-6 lg:col-span-12 glass-card rounded-3xl p-5 sm:p-8 border border-white/5 bento-inner-shadow">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Music size={14} className="text-primary" />
              </div>
              <h3 className="text-base md:text-2xl font-headline italic">Sonic Resonance</h3>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant opacity-50">Recommended Tracks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {result.musicRecommendations && result.musicRecommendations.map((track: any, idx: number) => (
              <a 
                key={idx} 
                href={`https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 md:gap-5 bg-white/[0.03] p-4 md:p-5 rounded-2xl hover:bg-white/[0.08] hover:border-white/10 border border-transparent transition-all group/track"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary group-hover/track:scale-110 transition-transform shadow-lg">
                   <Music size={16} className="md:w-5 md:h-5" />
                </div>
                  <div className="overflow-hidden">
                    <p className="font-headline italic text-on-surface text-sm md:text-xl leading-tight group-hover/track:text-secondary transition-colors truncate md:whitespace-normal">{track.title}</p>
                    <p className="text-[10px] md:text-sm text-on-surface-variant font-body opacity-70 mt-1 truncate md:whitespace-normal">{track.artist}</p>
                  </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full glass-card rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Sparkles className="text-secondary" size={20} />
          </div>
          <div>
            <h4 className="font-headline italic text-lg md:text-xl">Amplify the Vibe</h4>
            <p className="text-xs md:text-sm text-on-surface-variant">Let the collective know where you stand.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleNativeShare}
            className="bg-primary text-on-primary-container px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(216,230,252,0.2)]"
          >
            Share this Vibe
          </button>
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadImage}
              disabled={isExporting}
              className={`h-12 px-6 rounded-full border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              <span className="text-sm font-semibold hidden md:inline">Save Card</span>
            </motion.button>
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
