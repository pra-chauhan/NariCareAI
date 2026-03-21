import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { getProfile, getTodayLog, saveTodayLog, getLogs } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Clock, Droplets, Footprints, Moon, Pill } from 'lucide-react';

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
  const [showReport, setShowReport] = useState(false);

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

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Clock className="text-primary" size={24} /> Daily Care
        </h1>
      </motion.div>

      {/* 🔥 DOCTOR CONSULTATION */}
      <GlassCard className="p-4 border-l-4 border-primary">
        <h3 className="text-lg font-bold text-foreground">👩‍⚕️ Consult Doctor</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Share your AI-generated PCOS report with a specialist
        </p>

        <div className="flex gap-2 mt-3">
          <button className="bg-primary text-white px-3 py-1 rounded">
            📞 Audio Call
          </button>
          <button className="bg-primary text-white px-3 py-1 rounded">
            🎥 Video Call
          </button>
        </div>

        <button
          onClick={() => setShowReport(true)}
          className="mt-3 text-sm text-primary underline"
        >
          📄 View My Health Report
        </button>
      </GlassCard>

      {/* 🔥 REPORT MODAL */}
      {showReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-md">

            <h3 className="text-lg font-bold mb-2">PCOS Report</h3>

            {/* 👉 Replace with your real model data if available */}
            <p className="text-sm">Risk Score: <b className="text-red-500">High</b></p>
            <p className="text-sm">Lifestyle Score: Moderate</p>
            <p className="text-sm">Stress Risk: High</p>

            <p className="text-xs mt-2 text-muted-foreground">
              Key Factors: Irregular cycle, BMI, low hydration
            </p>

            <button
              onClick={() => setShowReport(false)}
              className="mt-3 bg-primary text-white px-3 py-1 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* Reminders */}
      <GlassCard>
        <h3 className="font-display text-lg text-foreground mb-3">Reminders</h3>
        <div className="space-y-2">
          {REMINDERS.map(({ key, icon: Icon, label, interval, color }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon size={18} className={color} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{interval}</p>
              </div>

              <button
                onClick={() => toggleReminder(key)}
                className={cn(
                  'w-12 h-6 rounded-full relative transition-all',
                  activeReminders.has(key) ? 'bg-primary' : 'bg-muted',
                )}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-md"
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
                'pill-badge text-xs',
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

    </div>
  );
};

export default DailyCarePage;