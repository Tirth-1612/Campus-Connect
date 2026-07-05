import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function PublicLayout({ children }){
  return (
    <div className="app-shell">
      <Header />
      <main className="container app-main">{children}</main>
      <Footer />
    </div>
  );
}
