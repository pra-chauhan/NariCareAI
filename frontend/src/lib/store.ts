export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  cycleLength: number;
  lastPeriodDate: string;
  periodDuration: number;
  hasPCOS: boolean;
  pcosScore?: number;
}

export interface DailyLog {
  date: string;
  calories: number;
  protein: number;
  water: number;
  weight?: number;
  energy?: number;
  symptoms: string[];
  medications: string[];
  exerciseMinutes: number;
  streak: number;
}

export type CyclePhase = 'period' | 'follicular' | 'ovulation' | 'luteal' | 'pms';

export const PHASE_COLORS: Record<CyclePhase, string> = {
  period: 'bg-primary',
  follicular: 'bg-sage',
  ovulation: 'bg-accent',
  luteal: 'bg-secondary',
  pms: 'bg-peach',
};

export const PHASE_LABELS: Record<CyclePhase, string> = {
  period: 'Period',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
  pms: 'PMS',
};

export function getCyclePhase(dayOfCycle: number, cycleLength: number): CyclePhase {
  if (dayOfCycle <= 5) return 'period';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulation';
  if (dayOfCycle <= cycleLength - 4) return 'luteal';
  return 'pms';
}

export function getDayOfCycle(lastPeriod: string, today: Date = new Date()): number {
  const lp = new Date(lastPeriod);
  const diff = Math.floor((today.getTime() - lp.getTime()) / (1000 * 60 * 60 * 24));
  return (diff % 28) + 1;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function calculateBMR(weight: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor for females
  return Math.round(10 * weight + 6.25 * heightCm - 5 * age - 161);
}

export function calculateTDEE(bmr: number, activity: string): number {
  const factors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  return Math.round(bmr * (factors[activity] || 1.2));
}

export function detectPCOS(params: {
  bmi: number;
  lhFshRatio: number;
  amh: number;
  testosterone: number;
  irregularPeriods: boolean;
  acne: boolean;
  hairLoss: boolean;
  weightGain: boolean;
  darkPatches: boolean;
  ultrasoundCysts: boolean;
}): { probability: number; risk: 'low' | 'medium' | 'high'; recommendations: string[] } {
  let score = 0;
  
  if (params.bmi > 25) score += 15;
  if (params.bmi > 30) score += 10;
  if (params.lhFshRatio > 2) score += 20;
  if (params.amh > 4.5) score += 15;
  if (params.testosterone > 0.8) score += 15;
  if (params.irregularPeriods) score += 10;
  if (params.acne) score += 5;
  if (params.hairLoss) score += 5;
  if (params.weightGain) score += 5;
  if (params.darkPatches) score += 5;
  if (params.ultrasoundCysts) score += 20;

  const probability = Math.min(100, score);
  const risk = probability < 30 ? 'low' : probability < 60 ? 'medium' : 'high';
  
  const recommendations: string[] = [];
  if (params.bmi > 25) recommendations.push('Focus on gradual weight management through balanced diet');
  if (params.lhFshRatio > 2) recommendations.push('Consult endocrinologist for hormonal evaluation');
  if (params.irregularPeriods) recommendations.push('Track cycles consistently and consider seed cycling');
  if (risk === 'high') {
    recommendations.push('Consider anti-inflammatory diet (avoid dairy, refined sugar)');
    recommendations.push('Include inositol-rich foods and omega-3 fatty acids');
    recommendations.push('Practice stress management through yoga and meditation');
  }
  if (risk === 'medium') {
    recommendations.push('Maintain regular exercise routine (150 min/week)');
    recommendations.push('Increase fiber and protein intake');
  }
  
  return { probability, risk, recommendations };
}

const PROFILE_KEY = 'aura_profile';
const LOGS_KEY = 'aura_logs';

export function getProfile(): UserProfile | null {
  const d = localStorage.getItem(PROFILE_KEY);
  return d ? JSON.parse(d) : null;
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function getLogs(): DailyLog[] {
  const d = localStorage.getItem(LOGS_KEY);
  return d ? JSON.parse(d) : [];
}

export function getTodayLog(): DailyLog {
  const today = new Date().toISOString().split('T')[0];
  const logs = getLogs();
  const existing = logs.find(l => l.date === today);
  if (existing) return existing;
  return {
    date: today,
    calories: 0, protein: 0, water: 0,
    symptoms: [], medications: [],
    exerciseMinutes: 0, streak: 0,
  };
}

export function saveTodayLog(log: DailyLog) {
  const logs = getLogs().filter(l => l.date !== log.date);
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}
