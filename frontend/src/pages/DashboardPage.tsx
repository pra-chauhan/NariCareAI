import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import OrbStat from '@/components/ui/OrbStat';
import ProgressBar3D from '@/components/ui/ProgressBar3D';
import {
  getProfile,
  getTodayLog,
  saveTodayLog,
  getDayOfCycle,
  getCyclePhase,
  PHASE_LABELS,
  calculateBMR,
  calculateTDEE
} from '@/lib/store';
import { Plus, Minus, Droplets } from 'lucide-react';

const DashboardPage = () => {
  const profile = getProfile()!;
  const [log, setLog] = useState(getTodayLog());
  const [streak, setStreak] = useState(6); //the 6 over here is just for instance. 

  const dayOfCycle = getDayOfCycle(profile.lastPeriodDate);
  const phase = getCyclePhase(dayOfCycle, profile.cycleLength);

  const bmr = calculateBMR(profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  useEffect(() => {
    saveTodayLog(log);
  }, [log]);

  const addValue = (key: 'water', amount: number) => {
    setLog(p => ({ ...p, [key]: Math.max(0, p[key] + amount) }));
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  
  const getAIInsight = () => {
    if (phase === 'pms') {
      return "Your body is in PMS phase — focus on rest, hydration, and stress reduction today.";
    }
    if (log.water < 4) {
      return "Low hydration detected — increasing water intake can help hormonal balance.";
    }
    return "You're maintaining good health habits — keep your routine consistent.";
  };

  return (
    <div className="space-y-5">

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground">
          {greeting()}, {profile.name} 🌸
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Day {dayOfCycle} · <span className="font-semibold text-primary">{PHASE_LABELS[phase]} Phase</span>
        </p>
      </motion.div>

      {/*  AI HEALTH INSIGHTTT */}
      <GlassCard tilt className="border-l-4 border-primary">
        <p className="text-xs font-semibold text-primary mb-1">🤖 AI Health Insight</p>
        <p className="text-sm text-foreground">{getAIInsight()}</p>
      </GlassCard>

      {/* Phase Card (Improved Emotional) */}
      <GlassCard tilt className="text-center">
        <span className="text-sm text-muted-foreground">Current Phase</span>
        <h2 className="text-xl font-bold capitalize text-primary">
          {PHASE_LABELS[phase]}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Take care of your body accordingly 💖
        </p>

        <ProgressBar3D
          value={dayOfCycle}
          max={profile.cycleLength}
          color="bg-primary"
          className="mt-3"
          label={`Day ${dayOfCycle} of ${profile.cycleLength}`}
        />
      </GlassCard>

      <GlassCard className="text-center">
        <p className="text-xs text-muted-foreground">🔥 Consistency Streak</p>
        <h2 className="text-xl font-bold text-primary">{streak} days</h2>
      </GlassCard>

      {/* Water Tracker */}
      <div className="flex justify-around">
        <OrbStat value={log.water} max={8} label="glasses" color="text-sage" />
      </div>

      {/* Quick Add */}
      <div className="grid grid-cols-1 gap-1">
        <GlassCard className="text-center p-3">
          <Droplets size={18} className="mx-auto mb-1 text-sage" />
          <span className="text-xs text-muted-foreground">Water</span>

          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              onClick={() => addValue('water', -1)}
              className="w-7 h-7 rounded-full glass-card flex items-center justify-center"
            >
              <Minus size={14} />
            </button>

            <span className="font-bold text-sm">{log.water}</span>

            <button
              onClick={() => addValue('water', 1)}
              className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
        </GlassCard>
      </div>

      
      <GlassCard className="border-l-4 border-accent">
        <p className="text-xs text-accent font-semibold mb-1">🧠 Smart Recommendation</p>
        <p className="text-sm text-foreground">
          Based on your current phase and activity, maintaining hydration and light exercise today can improve hormonal balance.
        </p>
      </GlassCard>

      {/* Calories */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="text-center p-3">
          <span className="text-xs text-muted-foreground">Daily Target</span>
          <p className="text-lg font-bold">{tdee} cal</p>
        </GlassCard>

        <GlassCard className="text-center p-3">
          <span className="text-xs text-muted-foreground">BMR</span>
          <p className="text-lg font-bold">{bmr} cal</p>
        </GlassCard>
      </div>

    </div>
  );
};

export default DashboardPage;