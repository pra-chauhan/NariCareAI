import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BackgroundOrbs from '@/components/layout/BackgroundOrbs';
import { saveProfile, UserProfile, calculateBMI } from '@/lib/store';
import { Flower2, ArrowRight, ArrowLeft } from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', age: '', weight: '', height: '',
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    cycleLength: '28', lastPeriodDate: '', periodDuration: '5',
  });

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleFinish = () => {
    const profile: UserProfile = {
      name: form.name,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      activityLevel: form.activityLevel,
      cycleLength: parseInt(form.cycleLength),
      lastPeriodDate: form.lastPeriodDate,
      periodDuration: parseInt(form.periodDuration),
      hasPCOS: false,
    };
    saveProfile(profile);
    navigate('/dashboard');
  };

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.lastPeriodDate.length > 0;
    if (step === 2) return form.age && form.weight && form.height;
    return true;
  };

  const inputClass = "soft-input w-full px-4 py-3 font-body text-foreground";
  const labelClass = "text-sm font-body text-muted-foreground mb-1 block";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <BackgroundOrbs />
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Flower2 className="text-primary" size={32} />
            <h1 className="text-3xl font-display text-foreground">Aura</h1>
          </div>
          <p className="text-sm font-body text-muted-foreground">Your Wellness Companion</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 space-y-5"
          >
            {step === 0 && (
              <>
                <h2 className="text-2xl font-display text-foreground">Welcome, beautiful! 🌸</h2>
                <p className="text-sm text-muted-foreground font-body">Let's get to know you a little</p>
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input className={inputClass} placeholder="Enter your name" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-display text-foreground">Your Cycle 🌙</h2>
                <p className="text-sm text-muted-foreground font-body">Help us personalize your experience</p>
                <div>
                  <label className={labelClass}>Last Period Start Date</label>
                  <input type="date" className={inputClass} value={form.lastPeriodDate} onChange={e => update('lastPeriodDate', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Cycle Length (days)</label>
                    <input type="number" className={inputClass} value={form.cycleLength} onChange={e => update('cycleLength', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Period Duration</label>
                    <input type="number" className={inputClass} value={form.periodDuration} onChange={e => update('periodDuration', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-display text-foreground">Your Body 💪</h2>
                <p className="text-sm text-muted-foreground font-body">For BMI and personalized diet plans</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" className={inputClass} placeholder="25" value={form.age} onChange={e => update('age', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Weight (kg)</label>
                    <input type="number" className={inputClass} placeholder="60" value={form.weight} onChange={e => update('weight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Height (cm)</label>
                  <input type="number" className={inputClass} placeholder="160" value={form.height} onChange={e => update('height', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Activity Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['sedentary', 'light', 'moderate', 'active'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => update('activityLevel', level)}
                        className={`pill-badge text-center capitalize ${
                          form.activityLevel === level
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-card text-foreground'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                {form.weight && form.height && (
                  <div className="text-center p-3 glass-card">
                    <span className="text-sm text-muted-foreground font-body">Your BMI: </span>
                    <span className="text-lg font-bold text-foreground font-display">
                      {calculateBMI(parseFloat(form.weight), parseFloat(form.height))}
                    </span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="glass" onClick={() => setStep(s => s - 1)} className="flex-1">
              <ArrowLeft size={16} /> Back
            </Button>
          )}
          <Button
            variant="rose"
            size="lg"
            className="flex-1"
            disabled={!canNext()}
            onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
          >
            {step < 2 ? 'Next' : 'Start Your Journey'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
