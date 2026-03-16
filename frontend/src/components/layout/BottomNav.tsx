import { NavLink } from 'react-router-dom';
import { Home, Flower2, Microscope, Salad, Dumbbell, Heart, Clock } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/cycle', icon: Flower2, label: 'Cycle' },
  { to: '/pcos', icon: Microscope, label: 'PCOS' },
  { to: '/diet', icon: Salad, label: 'Diet' },
  { to: '/exercise', icon: Dumbbell, label: 'Exercise' },
  { to: '/yoga', icon: Heart, label: 'Yoga' },
  { to: '/daily-care', icon: Clock, label: 'Care' },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-2 py-1 safe-area-bottom">
    <div className="flex justify-around items-center max-w-lg mx-auto">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-body ${
              isActive
                ? 'text-primary scale-110'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
