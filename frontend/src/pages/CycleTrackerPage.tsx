import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { getProfile, getDayOfCycle, getCyclePhase, PHASE_COLORS, PHASE_LABELS, CyclePhase, getTodayLog, saveTodayLog } from '@/lib/store';
import { cn } from '@/lib/utils';

const SYMPTOMS = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood Swings', 'Acne', 'Back Pain', 'Breast Tenderness', 'Insomnia', 'Cravings', 'Nausea', 'Hot Flashes'];

const CycleTrackerPage = () => {
  const profile = getProfile()!;
  const today = new Date();
  const dayOfCycle = getDayOfCycle(profile.lastPeriodDate);
  const currentPhase = getCyclePhase(dayOfCycle, profile.cycleLength);
  const [log, setLog] = useState(getTodayLog());

  const toggleSymptom = (s: string) => {
    const newLog = {
      ...log,
      symptoms: log.symptoms.includes(s)
        ? log.symptoms.filter(x => x !== s)
        : [...log.symptoms, s],
    };
    setLog(newLog);
    saveTodayLog(newLog);
  };

  // Generate 28-day calendar
  const calendarDays = Array.from({ length: profile.cycleLength }, (_, i) => {
    const day = i + 1;
    const phase = getCyclePhase(day, profile.cycleLength);
    return { day, phase, isToday: day === dayOfCycle };
  });

  const phaseInfo: Record<CyclePhase, string> = {
    period: 'Rest, hydrate, iron-rich foods. Light yoga recommended.',
    follicular: 'Energy rises! Great time for strength training and new activities.',
    ovulation: 'Peak energy and confidence. Best time for intense workouts.',
    luteal: 'Slow down, eat warming foods, focus on stress management.',
    pms: 'Be gentle with yourself. Magnesium-rich foods and rest help.',
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground">Cycle Tracker 🌙</h1>
        <p className="text-sm font-body text-muted-foreground">Day {dayOfCycle} of {profile.cycleLength}</p>
      </motion.div>

      {/* Phase Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PHASE_LABELS) as CyclePhase[]).map(phase => (
          <span key={phase} className={cn('pill-badge text-[10px]', PHASE_COLORS[phase], phase === 'period' || phase === 'ovulation' ? 'text-primary-foreground' : 'text-foreground')}>
            {PHASE_LABELS[phase]}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <GlassCard>
        <div className="grid grid-cols-7 gap-1.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-body text-muted-foreground font-semibold pb-1">{d}</div>
          ))}
          {calendarDays.map(({ day, phase, isToday }) => (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: day * 0.02 }}
              className={cn(
                'aspect-square rounded-lg flex items-center justify-center text-xs font-body font-semibold transition-all',
                PHASE_COLORS[phase],
                phase === 'period' || phase === 'ovulation' ? 'text-primary-foreground' : 'text-foreground',
                isToday && 'ring-2 ring-foreground ring-offset-1 scale-110',
              )}
            >
              {day}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Current Phase Info */}
      <GlassCard tilt className="border-l-4 border-primary">
        <h3 className="font-display text-lg text-foreground capitalize">{PHASE_LABELS[currentPhase]} Phase</h3>
        <p className="text-sm font-body text-muted-foreground mt-1">{phaseInfo[currentPhase]}</p>
      </GlassCard>

      {/* Symptom Logging */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">Log Symptoms</h3>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={cn(
                'pill-badge text-xs transition-all',
                log.symptoms.includes(s)
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-foreground hover:bg-primary/10',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Cycle Analytics */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">Cycle Analytics</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-display font-bold text-foreground">{profile.cycleLength}</p>
            <p className="text-[10px] font-body text-muted-foreground">Cycle Length</p>
          </div>
          <div>
            <p className="text-lg font-display font-bold text-foreground">{profile.periodDuration}</p>
            <p className="text-[10px] font-body text-muted-foreground">Period Days</p>
          </div>
          <div>
            <p className="text-lg font-display font-bold text-primary">
              {Math.round(profile.cycleLength / 2)}
            </p>
            <p className="text-[10px] font-body text-muted-foreground">Ovulation Day</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CycleTrackerPage;
