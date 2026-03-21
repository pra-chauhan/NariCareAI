import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { getProfile, calculateBMR, calculateTDEE, calculateBMI } from '@/lib/store';
import { PCOS_MEAL_PLAN, REGULAR_MEAL_PLAN, AVOID_LIST_PCOS, SUPERFOODS_PCOS, DEFICIENCY_CHECKS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Salad, AlertCircle, Sparkles, ShoppingCart, Stethoscope } from 'lucide-react';
import { generateDiet } from '@/lib/api';

const TABS = ['Generate AI Diet', 'Calculator', 'Avoid & Super'];

const DietPlanPage = () => {
  const profile = getProfile()!;
  const [tab, setTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<number>>(new Set());

  const bmr = calculateBMR(profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const bmi = calculateBMI(profile.weight, profile.height);
  const pcosAdjusted = profile.hasPCOS ? Math.round(tdee * 0.85) : tdee;

  const mealPlan = profile.hasPCOS ? PCOS_MEAL_PLAN : REGULAR_MEAL_PLAN;
  const dayIndex = new Date().getDate() % 3;

  const [aiDiet, setAiDiet] = useState<any>(null);
  const [loadingDiet, setLoadingDiet] = useState(false);


const handleGenerateDiet = async () => {
  try {
    setLoadingDiet(true);

    const res = await generateDiet();

    console.log("TYPE:", typeof res?.diet_plan);
    console.log("RAW DATA:", res?.diet_plan);
    console.log("FULL API RESPONSE:", res);

    if (!res) {
      throw new Error("No response from backend");
    }

    if (res.success) {
      try {
        let text = res.diet_plan;

       
        if (typeof text === "object") {
          setAiDiet(text);
          return;
        }

       
        text = text
          ?.replace(/```json/gi, "")
          ?.replace(/```/g, "")
          ?.trim();

        console.log("CLEANED TEXT:", text);

        
        const parsed = JSON.parse(text);

        setAiDiet(parsed);

      } catch (e) {
        console.error("FINAL PARSE FAILED:", e);

        
        setAiDiet({
          raw: res.diet_plan,
        });
      }

    } else {
      console.error("Backend error:", res.error);
    }

  } catch (err) {
    console.error("Diet error:", err);
  } finally {
    setLoadingDiet(false);
  }
};

  const todayMeals = useMemo(() => ({
    breakfast: mealPlan.breakfast[dayIndex % mealPlan.breakfast.length],
    midMorning: mealPlan.midMorning[dayIndex % mealPlan.midMorning.length],
    lunch: mealPlan.lunch[dayIndex % mealPlan.lunch.length],
    evening: mealPlan.evening[dayIndex % mealPlan.evening.length],
    dinner: mealPlan.dinner[dayIndex % mealPlan.dinner.length],
  }), [dayIndex]);

  const totalCal = Object.values(todayMeals).reduce((s, m) => s + m.calories, 0);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => {
      const n = new Set(prev);
      n.has(item) ? n.delete(item) : n.add(item);
      return n;
    });
  };

  // Generate grocery list from today's meals
  const groceryItems = useMemo(() => {
    const items = new Set<string>();
    Object.values(todayMeals).forEach(meal => {
      meal.name.split(/[+&,]/).forEach(part => items.add(part.trim()));
    });
    
    ['Brown Rice', 'Dal', 'Curd', 'Ghee', 'Turmeric', 'Fresh Vegetables', 'Fruits', 'Flaxseeds', 'Walnuts'].forEach(i => items.add(i));
    return Array.from(items);
  }, [todayMeals]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Salad className="text-sage" size={24} /> Diet Plan
        </h1>
        {profile.hasPCOS && (
          <span className="pill-badge bg-primary text-primary-foreground text-[10px] mt-1 inline-block">PCOS-Optimized</span>
        )}
      </motion.div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 glass-card p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={cn(
              'pill-badge whitespace-nowrap text-xs transition-all flex-shrink-0',
              tab === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Today's Meals */}
      {tab === 0 && (
  <div className="space-y-3">

    <Button onClick={handleGenerateDiet} className="w-full">
      {loadingDiet ? "Generating AI Diet..." : "Generate AI Diet Plan"}
    </Button>

    {/* AI DIET DISPLAY */}
    {aiDiet && (
  <div className="space-y-3 mt-4">

    {/* If structured JSON */}
    {aiDiet.days && aiDiet.days.map((day:any, i:number) => (
      <GlassCard key={i}>
        <h3 className="font-semibold mb-2">{day.day}</h3>

        {Object.entries(day.meals).map(([meal, value]) => (
          <div key={meal} className="mb-2">
            <span className="text-xs text-primary capitalize">{meal}</span>
            <p className="text-sm">{value as string}</p>
          </div>
        ))}
      </GlassCard>
    ))}

    {/* If plain text */}
    {aiDiet.raw && (
      <GlassCard>
        <pre className="text-sm whitespace-pre-wrap">
          {aiDiet.raw}
        </pre>
      </GlassCard>
    )}

  </div>
)}


  </div>
)}

      {/* Calculator */}
      {tab === 1 && (
        <div className="space-y-3">
          <GlassCard>
            <h3 className="font-display text-lg text-foreground mb-3">Calorie Calculator</h3>
            <p className="text-xs font-body text-muted-foreground mb-3">Mifflin-St Jeor equation{profile.hasPCOS ? ' + PCOS 15% reduction' : ''}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'BMI', value: bmi },
                { label: 'BMR', value: `${bmr} cal` },
                { label: 'TDEE', value: `${tdee} cal` },
                { label: profile.hasPCOS ? 'PCOS Target' : 'Target', value: `${pcosAdjusted} cal` },
              ].map(({ label, value }) => (
                <div key={label} className="glass-card p-3 text-center">
                  <span className="text-[10px] font-body text-muted-foreground">{label}</span>
                  <p className="text-lg font-display font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 glass-card">
              <p className="text-xs font-body text-muted-foreground">
                <strong>Protein:</strong> {Math.round(profile.weight * 1.2)}g/day · 
                <strong> Fiber:</strong> 25-30g/day · 
                <strong> Water:</strong> 2.5-3L/day
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Avoid & Superfoods */}
      {tab === 2 && (
        <div className="space-y-4">
          {profile.hasPCOS && (
            <GlassCard className="border-l-4 border-destructive">
              <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-destructive" /> Foods to Avoid
              </h3>
              {AVOID_LIST_PCOS.map(item => (
                <div key={item} className="flex items-center gap-2 py-1 text-sm font-body text-foreground">
                  <span className="text-destructive">✕</span> {item}
                </div>
              ))}
            </GlassCard>
          )}
          <GlassCard className="border-l-4 border-accent">
            <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-accent" /> Superfoods
            </h3>
            {SUPERFOODS_PCOS.map(({ name, benefit }) => (
              <div key={name} className="py-1.5 border-b border-border/30 last:border-0">
                <span className="text-sm font-body font-semibold text-foreground">{name}</span>
                <p className="text-[10px] font-body text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      )}

     

      {/* Deficiency */}
      {tab === 4 && (
        <GlassCard>
          <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
            <Stethoscope size={18} className="text-primary" /> Deficiency Detection
          </h3>
          <p className="text-xs font-body text-muted-foreground mb-3">Select symptoms you experience</p>
          {DEFICIENCY_CHECKS.map((check, i) => (
            <button
              key={i}
              onClick={() => setSelectedSymptoms(prev => {
                const n = new Set(prev);
                n.has(i) ? n.delete(i) : n.add(i);
                return n;
              })}
              className={cn(
                'w-full text-left p-3 rounded-lg mb-2 transition-all',
                selectedSymptoms.has(i) ? 'glass-card border-primary border' : 'glass-card opacity-70',
              )}
            >
              <p className="text-sm font-body font-semibold text-foreground">{check.symptom}</p>
              {selectedSymptoms.has(i) && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                  <p className="text-xs font-body text-primary mt-1">Possible: {check.deficiency}</p>
                  <p className="text-xs font-body text-muted-foreground">Try: {check.foods}</p>
                </motion.div>
              )}
            </button>
          ))}
        </GlassCard>
      )}
    </div>
  );
};

export default DietPlanPage;
