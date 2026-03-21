import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import {
  getProfile,
  getDayOfCycle,
  getCyclePhase,
  PHASE_COLORS,
  PHASE_LABELS,
  CyclePhase,
  getTodayLog,
  saveTodayLog
} from '@/lib/store';
import { cn } from '@/lib/utils';

const SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood Swings',
  'Acne', 'Back Pain', 'Breast Tenderness', 'Insomnia',
  'Cravings', 'Nausea', 'Hot Flashes'
];

type PhaseDetails = {
  title: string;
  icon: string;
  description: string;
  bodyChanges: string;
  mood: string;
  tips: string;
};

const phaseInfo: Record<CyclePhase, PhaseDetails> = {
  period: {
    title: "Menstrual Phase",
    icon: "🩸",
    description: "Your body sheds the uterine lining, causing your period.",
    bodyChanges: "Hormones are at their lowest → low energy, fatigue.",
    mood: "Low energy, reflective, need rest",
    tips: "Rest, hydrate, iron-rich foods."
  },
  follicular: {
    title: "Follicular Phase",
    icon: "🌱",
    description: "Estrogen rises and body prepares an egg.",
    bodyChanges: "Energy increases, sharper thinking.",
    mood: "Motivated, fresh",
    tips: "Start new tasks, workouts."
  },
  ovulation: {
    title: "Ovulation Phase",
    icon: "🔥",
    description: "Egg is released. Fertile window.",
    bodyChanges: "Peak energy & confidence.",
    mood: "Confident, social",
    tips: "Best time for important work."
  },
  luteal: {
    title: "Luteal Phase",
    icon: "🌙",
    description: "Body prepares for pregnancy.",
    bodyChanges: "Energy drops slowly.",
    mood: "Calm",
    tips: "Slow down, self-care."
  },
  pms: {
    title: "PMS Phase",
    icon: "⚡",
    description: "Hormones drop before period.",
    bodyChanges: "Mood swings, fatigue.",
    mood: "Sensitive",
    tips: "Rest, avoid stress."
  }
};

const CycleTrackerPage = () => {
  const profile = getProfile()!;
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

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

  //  Get cycle day for ANY date
  const getCycleDayFromDate = (date: Date) => {
    const start = new Date(profile.lastPeriodDate);
    const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return ((diff % profile.cycleLength) + profile.cycleLength) % profile.cycleLength + 1;
  };

  //  Generate real calendar
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const calendarDays = getMonthDays().map(date => {
    if (!date) return null;

    const cycleDay = getCycleDayFromDate(date);
    const phase = getCyclePhase(cycleDay, profile.cycleLength);

    const isToday = date.toDateString() === today.toDateString();

    // Fertile window logic
    const ovulationDay = Math.round(profile.cycleLength / 2);
    const isFertile =
      cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 2;

    return { date, phase, isToday, isFertile, cycleDay };
  });

  const selectedCycleDay = selectedDate ? getCycleDayFromDate(selectedDate) : null;
  const selectedPhase = selectedCycleDay
    ? getCyclePhase(selectedCycleDay, profile.cycleLength)
    : null;

  const phase = selectedPhase ? phaseInfo[selectedPhase] : null;

  // AI Insight
  const getAIInsight = () => {
    if (log.symptoms.includes('Fatigue'))
      return "Your body is signaling rest. Slow down today.";

    if (selectedPhase === 'ovulation')
      return "High energy day — use it for important work.";

    if (selectedPhase === 'pms')
      return "Take care, emotions may feel stronger today.";

    return "Stay in sync with your body 🌸";
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <h1 className="text-2xl font-display">Cycle Tracker 🌙</h1>

      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
          ←
        </button>
        <p className="font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
          →
        </button>
      </div>

      {/* Calendar */}
      <GlassCard>
        <div className="grid grid-cols-7 gap-1.5">
          {['S','M','T','W','T','F','S'].map(d => (
            <div key={d} className="text-center text-xs">{d}</div>
          ))}

          {calendarDays.map((item, i) => (
            <div key={i}>
              {!item ? (
                <div />
              ) : (
                <motion.div
                  onClick={() => setSelectedDate(item.date)}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-lg text-xs cursor-pointer',
                    PHASE_COLORS[item.phase],
                    item.isToday && 'ring-2 scale-110',
                    item.isFertile && 'border-2 border-yellow-400'
                  )}
                >
                  {item.date.getDate()}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Selected Day Info */}
      {phase && (
        <GlassCard>
          <h3 className="text-lg">
            {phase.icon} {phase.title}
          </h3>
          <p>{phase.description}</p>
          <p className="text-sm">{phase.bodyChanges}</p>
          <p className="text-sm">{phase.mood}</p>
          <p className="text-sm">{phase.tips}</p>
        </GlassCard>
      )}

      {/* AI Insight */}
      {/* <GlassCard>
        <h3>🤖 AI Insight</h3>
        <p>{getAIInsight()}</p>
      </GlassCard> */}

      {/* Symptoms */}
      {/* <GlassCard>
        <h3>Log Symptoms</h3>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={cn(
                'pill-badge',
                log.symptoms.includes(s)
                  ? 'bg-primary text-white'
                  : 'glass-card'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard> */}

    </div>
  );
};

export default CycleTrackerPage;