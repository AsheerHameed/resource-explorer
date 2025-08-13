import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-orange-800 bg-white">
        <Header />
      </header>

      <main className="flex-1 overflow-y-auto pt-16">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
