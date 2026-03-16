import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { YOGA_ASANAS, PRANAYAM_TECHNIQUES, STRESS_ASANAS, DESK_STRETCHES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Heart, Play, Pause, RotateCcw, Timer } from 'lucide-react';

const TABS = ['Asanas', 'Pranayam', 'Stress Relief', 'Desk Stretch', 'Timer'];

const YogaPage = () => {
  const [tab, setTab] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (timerSeconds === 0) setTimerRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, timerSeconds]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Heart className="text-primary" size={24} /> Yoga & Pranayam
        </h1>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 glass-card p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={cn(
              'pill-badge whitespace-nowrap text-xs transition-all flex-shrink-0',
              tab === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Asanas */}
      {tab === 0 && (
        <div className="space-y-3">
          <p className="text-sm font-body text-muted-foreground">6 key PCOS-healing asanas</p>
          {YOGA_ASANAS.map((asana, i) => (
            <motion.div key={asana.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard tilt>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🧘‍♀️</span>
                  <div className="flex-1">
                    <h4 className="font-display text-sm text-foreground">{asana.name}</h4>
                    <p className="text-[10px] font-body text-primary">{asana.english} · {asana.duration}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{asana.benefit}</p>
                    <p className="text-xs font-body text-foreground mt-1 leading-relaxed">{asana.instruction}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pranayam */}
      {tab === 1 && (
        <div className="space-y-3">
          <p className="text-sm font-body text-muted-foreground">4 breathing techniques for hormonal balance</p>
          {PRANAYAM_TECHNIQUES.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard tilt>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌬️</span>
                  <div className="flex-1">
                    <h4 className="font-display text-sm text-foreground">{p.name}</h4>
                    <p className="text-[10px] font-body text-primary">{p.english} · {p.duration}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{p.benefit}</p>
                    <p className="text-xs font-body text-foreground mt-1 leading-relaxed">{p.instruction}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stress Relief */}
      {tab === 2 && (
        <div className="space-y-3">
          <p className="text-sm font-body text-muted-foreground">Calming poses for stress management</p>
          {STRESS_ASANAS.map((a, i) => (
            <GlassCard key={a.name} tilt>
              <h4 className="font-display text-sm text-foreground">{a.name} ({a.english})</h4>
              <p className="text-[10px] font-body text-primary">{a.duration}</p>
              <p className="text-xs font-body text-muted-foreground mt-1">{a.benefit}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Desk Stretch */}
      {tab === 3 && (
        <div className="space-y-3">
          <GlassCard className="border-l-4 border-accent">
            <h3 className="font-display text-base text-foreground">5-Min Desk Stretch Session ⏰</h3>
            <p className="text-xs font-body text-muted-foreground">Perfect between work breaks</p>
          </GlassCard>
          {DESK_STRETCHES.map((s, i) => (
            <GlassCard key={s.name}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-body">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">{s.name} ({s.duration})</h4>
                  <p className="text-xs font-body text-muted-foreground">{s.instruction}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Timer */}
      {tab === 4 && (
        <div className="space-y-4">
          <GlassCard className="text-center py-8">
            <Timer className="mx-auto text-primary mb-4" size={32} />
            <div className="text-5xl font-display font-bold text-foreground mb-6">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex justify-center gap-3 mb-6">
              {[120, 300, 600, 900].map(s => (
                <button
                  key={s}
                  onClick={() => { setTimerSeconds(s); setTimerPreset(s); setTimerRunning(false); }}
                  className={cn(
                    'pill-badge text-xs',
                    timerPreset === s ? 'bg-primary text-primary-foreground' : 'glass-card text-foreground',
                  )}
                >
                  {s / 60}m
                </button>
              ))}
            </div>
            {/* Progress ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(timerSeconds / timerPreset) * 283} 283`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="rose"
                size="lg"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? <Pause size={18} /> : <Play size={18} />}
                {timerRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="glass"
                size="lg"
                onClick={() => { setTimerSeconds(timerPreset); setTimerRunning(false); }}
              >
                <RotateCcw size={18} /> Reset
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default YogaPage;
