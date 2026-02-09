import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header />
      <main className="app-gradient-bg flex w-full flex-1 items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
