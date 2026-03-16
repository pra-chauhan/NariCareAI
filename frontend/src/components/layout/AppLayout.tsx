import { Outlet } from 'react-router-dom';
import BackgroundOrbs from './BackgroundOrbs';
import BottomNav from './BottomNav';

const AppLayout = () => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    <BackgroundOrbs />
    <main className="relative z-10 pb-20 px-4 pt-6 max-w-lg mx-auto">
      <Outlet />
    </main>
    <BottomNav />
  </div>
);

export default AppLayout;
