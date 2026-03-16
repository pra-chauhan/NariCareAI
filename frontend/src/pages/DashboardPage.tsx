import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import OrbStat from '@/components/ui/OrbStat';
import ProgressBar3D from '@/components/ui/ProgressBar3D';
import { getProfile, getTodayLog, saveTodayLog, getDayOfCycle, getCyclePhase, PHASE_LABELS, calculateBMR, calculateTDEE } from '@/lib/store';
import { DAILY_TIPS } from '@/lib/data';
import { Plus, Minus, Droplets, Flame, Dumbbell } from 'lucide-react';

const DashboardPage = () => {
  const profile = getProfile()!;
  const [log, setLog] = useState(getTodayLog());
  const dayOfCycle = getDayOfCycle(profile.lastPeriodDate);
  const phase = getCyclePhase(dayOfCycle, profile.cycleLength);
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const bmr = calculateBMR(profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  useEffect(() => { saveTodayLog(log); }, [log]);

  const addValue = (key: 'calories' | 'protein' | 'water', amount: number) => {
    setLog(p => ({ ...p, [key]: Math.max(0, p[key] + amount) }));
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground">{greeting()}, {profile.name} 🌸</h1>
        <p className="text-sm font-body text-muted-foreground mt-1">
          Day {dayOfCycle} · <span className="capitalize font-semibold text-primary">{PHASE_LABELS[phase]} Phase</span>
        </p>
      </motion.div>

      {/* Phase Card */}
      <GlassCard tilt className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-body text-muted-foreground">Current Phase</span>
        </div>
        <h2 className="text-xl font-display text-foreground capitalize">{PHASE_LABELS[phase]}</h2>
        <ProgressBar3D value={dayOfCycle} max={profile.cycleLength} color="bg-primary" className="mt-3" label={`Day ${dayOfCycle} of ${profile.cycleLength}`} />
      </GlassCard>

      {/* Quick Stats */}
      <div className="flex justify-around">
        <OrbStat value={log.calories} max={tdee} label="cal" color="text-primary" />
        <OrbStat value={log.protein} max={Math.round(profile.weight * 1.2)} label="g protein" color="text-accent" />
        <OrbStat value={log.water} max={8} label="glasses" color="text-sage" />
      </div>

      {/* Quick Add */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'calories' as const, icon: Flame, amount: 100, label: 'Cal', color: 'text-primary' },
          { key: 'protein' as const, icon: Dumbbell, amount: 10, label: 'Protein', color: 'text-accent' },
          { key: 'water' as const, icon: Droplets, amount: 1, label: 'Water', color: 'text-sage' },
        ].map(({ key, icon: Icon, amount, label, color }) => (
          <GlassCard key={key} className="text-center p-3">
            <Icon size={18} className={`mx-auto mb-1 ${color}`} />
            <span className="text-xs font-body text-muted-foreground">{label}</span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button onClick={() => addValue(key, -amount)} className="w-7 h-7 rounded-full glass-card flex items-center justify-center text-foreground">
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm font-body text-foreground">{log[key]}</span>
              <button onClick={() => addValue(key, amount)} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Daily Tip */}
      <GlassCard tilt className="border-l-4 border-accent">
        <p className="text-xs font-body text-accent font-semibold mb-1">✨ Daily Tip</p>
        <p className="text-sm font-body text-foreground leading-relaxed">{DAILY_TIPS[tipIndex]}</p>
      </GlassCard>

      {/* Quick BMI/TDEE */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="text-center p-3">
          <span className="text-xs font-body text-muted-foreground">Daily Target</span>
          <p className="text-lg font-display font-bold text-foreground">{tdee} cal</p>
        </GlassCard>
        <GlassCard className="text-center p-3">
          <span className="text-xs font-body text-muted-foreground">BMR</span>
          <p className="text-lg font-display font-bold text-foreground">{bmr} cal</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
