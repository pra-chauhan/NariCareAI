import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import ProgressBar3D from '@/components/ui/ProgressBar3D';
import { getProfile, getDayOfCycle, getCyclePhase, getTodayLog, saveTodayLog, getLogs } from '@/lib/store';
import { EXERCISES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Dumbbell, Flame, CheckCircle2, Trophy } from 'lucide-react';

const ExercisePage = () => {
  const profile = getProfile()!;
  const dayOfCycle = getDayOfCycle(profile.lastPeriodDate);
  const phase = getCyclePhase(dayOfCycle, profile.cycleLength);
  const [log, setLog] = useState(getTodayLog());

  const phaseExercises = EXERCISES.filter(e => e.phases.includes(phase));
  const restrictedExercises = EXERCISES.filter(e => !e.phases.includes(phase));

  
  const logs = getLogs();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLog = logs.find(l => l.date === dateStr);
    if (dayLog && dayLog.exerciseMinutes > 0) streak++;
    else if (i > 0) break;
  }

  const addExerciseMinutes = (mins: number) => {
    const newLog = { ...log, exerciseMinutes: log.exerciseMinutes + mins };
    setLog(newLog);
    saveTodayLog(newLog);
  };

  const typeColors = {
    cardio: 'text-primary',
    strength: 'text-accent',
    flexibility: 'text-sage',
    rest: 'text-secondary',
  };

  const typeIcons = {
    cardio: '🏃‍♀️',
    strength: '💪',
    flexibility: '🧘',
    rest: '😴',
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Dumbbell className="text-accent" size={24} /> Exercise
        </h1>
        <p className="text-sm font-body text-muted-foreground capitalize">
          {phase} phase workouts
        </p>
      </motion.div>

      {/* Today's Progress */}
      <GlassCard tilt className="flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar3D value={log.exerciseMinutes} max={45} color="bg-primary" label="Today's Activity" />
        </div>
        <div className="text-center">
          <Flame className="text-primary mx-auto" size={20} />
          <span className="text-xs font-body text-muted-foreground">{log.exerciseMinutes} min</span>
        </div>
      </GlassCard>

      {/* Streak */}
      <GlassCard className="flex items-center gap-3">
        <Trophy className="text-accent" size={28} />
        <div>
          <p className="font-display text-xl text-foreground">{streak} Day Streak 🔥</p>
          <p className="text-xs font-body text-muted-foreground">Keep going! Consistency is key.</p>
        </div>
      </GlassCard>

      {/* Recommended Exercises */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-3">Recommended for {phase} phase</h3>
        <div className="space-y-2">
          {phaseExercises.map((ex, i) => (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="flex items-center gap-3">
                <span className="text-2xl">{typeIcons[ex.type]}</span>
                <div className="flex-1">
                  <h4 className="font-body text-sm font-semibold text-foreground">{ex.name}</h4>
                  <p className="text-[10px] font-body text-muted-foreground">{ex.description}</p>
                  <span className={cn('text-[10px] font-semibold', typeColors[ex.type])}>{ex.duration}</span>
                </div>
                <button
                  onClick={() => addExerciseMinutes(parseInt(ex.duration) || 15)}
                  className="pill-badge bg-primary text-primary-foreground text-[10px]"
                >
                  <CheckCircle2 size={12} /> Done
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Restricted */}
      {restrictedExercises.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
            ⚠️ Not Recommended Now
          </h3>
          <div className="space-y-2 opacity-60">
            {restrictedExercises.slice(0, 3).map(ex => (
              <GlassCard key={ex.name} className="flex items-center gap-3">
                <span className="text-xl">{typeIcons[ex.type]}</span>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground">{ex.name}</h4>
                  <p className="text-[10px] font-body text-muted-foreground">Better suited for other phases</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">This Week</h3>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const dayLog = logs.find(l => l.date === dateStr);
            const mins = dayLog?.exerciseMinutes || 0;
            const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            return (
              <div key={i} className="flex-1 text-center">
                <div
                  className={cn(
                    'h-16 rounded-lg mb-1 flex items-end justify-center transition-all',
                    mins > 0 ? 'bg-primary/20' : 'bg-muted',
                  )}
                >
                  <div
                    className="w-full bg-primary rounded-lg transition-all"
                    style={{ height: `${Math.min(100, (mins / 45) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-body text-muted-foreground">{dayNames[d.getDay()]}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

export default ExercisePage;
