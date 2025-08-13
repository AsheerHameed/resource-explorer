import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const App = () => {
   return (
    <div className="flex flex-col min-h-screen p-8">
      <header className="fixed top-0 left-0 right-0 z-50 shadow-orange-800">
        <Header />
      </header>
      <main className="flex-1 overflow-y-auto pt-[var(--header-height)] pb-[var(--footer-height)] my-4">
        <Outlet />
      </main>
       <footer className="fixed bottom-0 left-0 right-0 z-50 shadow-3xl bg-gray-200 py-4 px-8">
        <Footer />
      </footer>
    </div>
  );
}

export default App