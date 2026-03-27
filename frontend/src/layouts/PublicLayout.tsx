import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import './PublicLayout.css';

export default function PublicLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-main">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
