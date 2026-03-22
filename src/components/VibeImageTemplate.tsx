import React, { forwardRef } from 'react';
import { Heart, Sparkles, Music } from 'lucide-react';

interface VibeImageTemplateProps {
  vibe: any;
}

export const VibeImageTemplate = forwardRef<HTMLDivElement, VibeImageTemplateProps>(
  ({ vibe }, ref) => {
    if (!vibe) return null;

    const voices = Array.isArray(vibe.realVoices) ? vibe.realVoices : 
                   (typeof vibe.realVoices === 'string' && vibe.realVoices !== '' ? JSON.parse(vibe.realVoices) : []);

    return (
      <div 
        className="absolute -left-[9999px] top-0 pointer-events-none" 
        style={{ width: '1080px', height: '1080px' }}
      >
        <div 
          ref={ref}
          className="w-[1080px] h-[1080px] bg-[#0A0A0B] text-white flex flex-col items-center justify-center p-20 relative overflow-hidden font-sans"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen opacity-50 -translate-x-1/2 translate-y-1/2" />
          
          {/* Header */}
          <div className="absolute top-16 left-16 flex items-center gap-3 opacity-60">
            <Sparkles className="text-secondary" size={32} />
            <span className="text-2xl font-bold tracking-widest uppercase">VibeCheck AI</span>
          </div>

          <div className="absolute top-16 right-16 px-6 py-2 rounded-full border border-secondary/30 text-secondary text-xl font-bold uppercase tracking-widest">
            Recorded Frequency
          </div>

          {/* Main Content Area */}
          <div className="w-full h-full flex flex-col items-center justify-center z-10 text-center space-y-12">
            <div>
              <h1 className="text-8xl font-bold italic mb-6 leading-tight max-w-4xl min-h-[120px]">
                "{vibe.vibeLabel}"
              </h1>
              <p className="text-4xl italic text-primary-dim opacity-90 max-w-3xl mx-auto leading-relaxed">
                "{vibe.aiRemix}"
              </p>
            </div>

            {vibe.supportMessage && (
              <div className="w-full max-w-3xl p-8 rounded-3xl bg-secondary/10 border border-secondary/30 backdrop-blur-md relative mt-8 shadow-2xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1A1A1A] border border-secondary/30 rounded-full text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                   <Sparkles size={16} /> Message of Resonance
                </div>
                <p className="text-2xl text-secondary-dim leading-relaxed text-center font-medium pt-4">
                   {vibe.supportMessage}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mt-12 pb-16">
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-center backdrop-blur-md">
                 <Heart className="text-secondary mb-4" size={48} fill="currentColor" />
                 <p className="text-6xl font-bold mb-2">{(vibe.likes || 0).toLocaleString()}</p>
                 <p className="text-lg uppercase tracking-widest text-secondary-dim font-bold">Real Resonance</p>

                 <div className="mt-6 pt-4 border-t border-white/20 w-full text-center">
                    <p className="text-2xl font-bold text-white/70">{(vibe.pulseCount || 0).toLocaleString()}</p>
                    <p className="text-sm uppercase tracking-widest text-white/50 font-bold mt-1">AI Global Pulse • {vibe.growthPercentage}</p>
                 </div>
              </div>
              
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-center backdrop-blur-md space-y-4">
                 <p className="text-2xl font-bold italic text-primary-dim text-center leading-snug">
                   "{voices[0] || 'Silence is sometimes the loudest feeling.'}"
                 </p>
                 <div className="flex items-center gap-2 mt-4 opacity-60">
                   <span className="text-xl font-bold">@anon</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer Footer */}
          <div className="absolute bottom-12 w-full text-center opacity-40">
            <p className="text-xl tracking-[0.2em] font-medium uppercase text-white/70">
              Generate yours at <span className="text-white font-bold">vibecheck.ai</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

VibeImageTemplate.displayName = 'VibeImageTemplate';
