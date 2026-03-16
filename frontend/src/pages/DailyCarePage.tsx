import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import ProgressBar3D from '@/components/ui/ProgressBar3D';
import { getProfile, getTodayLog, saveTodayLog, getLogs } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Clock, Droplets, Footprints, Moon, Pill, TrendingUp } from 'lucide-react';

const REMINDERS = [
  { key: 'water', icon: Droplets, label: 'Drink Water', interval: 'Every 2 hours', color: 'text-sage' },
  { key: 'walk', icon: Footprints, label: '10-min Walk', interval: 'After meals', color: 'text-primary' },
  { key: 'stretch', icon: Clock, label: 'Stretch Break', interval: 'Every 3 hours', color: 'text-accent' },
  { key: 'sleep', icon: Moon, label: 'Sleep by 10 PM', interval: 'Daily', color: 'text-secondary' },
];

const MEDICATIONS = ['Vitamin D', 'Iron', 'Inositol', 'Omega-3', 'Folic Acid', 'Zinc', 'Magnesium'];

const DailyCarePage = () => {
  const profile = getProfile()!;
  const [log, setLog] = useState(getTodayLog());
  const [activeReminders, setActiveReminders] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('aura_reminders') || '["water","walk","stretch","sleep"]'))
  );
  const logs = getLogs();

  useEffect(() => { saveTodayLog(log); }, [log]);

  const toggleReminder = (key: string) => {
    setActiveReminders(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      localStorage.setItem('aura_reminders', JSON.stringify([...n]));
      return n;
    });
  };

  const toggleMed = (med: string) => {
    setLog(prev => ({
      ...prev,
      medications: prev.medications.includes(med)
        ? prev.medications.filter(m => m !== med)
        : [...prev.medications, med],
    }));
  };

  // Weekly weight/energy data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLog = logs.find(l => l.date === dateStr);
    return {
      day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
      weight: dayLog?.weight || 0,
      energy: dayLog?.energy || 0,
    };
  });

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Clock className="text-primary" size={24} /> Daily Care
        </h1>
      </motion.div>

      {/* Reminders */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">Reminders</h3>
        <div className="space-y-2">
          {REMINDERS.map(({ key, icon: Icon, label, interval, color }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon size={18} className={color} />
              <div className="flex-1">
                <p className="text-sm font-body font-semibold text-foreground">{label}</p>
                <p className="text-[10px] font-body text-muted-foreground">{interval}</p>
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggleReminder(key)}
                className={cn(
                  'w-12 h-6 rounded-full relative transition-all duration-300',
                  activeReminders.has(key) ? 'bg-primary' : 'bg-muted',
                )}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-primary-foreground absolute top-0.5 shadow-md"
                  animate={{ left: activeReminders.has(key) ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Medication Tracker */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
          <Pill size={18} className="text-primary" /> Medication Tracker
        </h3>
        <div className="flex flex-wrap gap-2">
          {MEDICATIONS.map(med => (
            <button
              key={med}
              onClick={() => toggleMed(med)}
              className={cn(
                'pill-badge text-xs transition-all',
                log.medications.includes(med)
                  ? 'bg-sage text-sage-foreground'
                  : 'glass-card text-foreground',
              )}
            >
              {log.medications.includes(med) ? '✓ ' : ''}{med}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Daily Logging */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">Today's Check-in</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1 block">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="soft-input w-full px-3 py-2.5 text-sm font-body text-foreground"
              value={log.weight || ''}
              onChange={e => setLog(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))}
              placeholder={`Last: ${profile.weight} kg`}
            />
          </div>
          <div>
            <label className="text-xs font-body text-muted-foreground mb-2 block">Energy Level</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setLog(p => ({ ...p, energy: level }))}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-body font-semibold transition-all',
                    log.energy === level
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card text-foreground',
                  )}
                >
                  {['😴', '😐', '🙂', '😊', '🤩'][level - 1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Progress Monitoring */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-primary" /> Weekly Progress
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-xs font-body text-muted-foreground">Energy Trend</span>
            <div className="flex gap-1.5 mt-1">
              {weekData.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-12 rounded-lg bg-muted flex items-end justify-center">
                    <div
                      className="w-full bg-accent rounded-lg transition-all"
                      style={{ height: `${(d.energy / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-body text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
          <ProgressBar3D
            value={log.water}
            max={8}
            color="bg-sage"
            label="Water Intake"
          />
          <ProgressBar3D
            value={log.exerciseMinutes}
            max={45}
            color="bg-primary"
            label="Exercise"
          />
        </div>
      </GlassCard>
    </div>
  );
};

export default DailyCarePage;
