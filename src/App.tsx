import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Connexion from "./pages/Connexion";
import Dashboard from "./pages/app/Dashboard";
import AppAcheter from "./pages/app/AppAcheter";
import AppVendre from "./pages/app/AppVendre";
import Envoyer from "./pages/app/Envoyer";
import AppOTC from "./pages/app/AppOTC";
import Compte from "./pages/app/Compte";
import AdminPortal from "./pages/admin/AdminPortal";
import RequireAuth from "./components/app/RequireAuth";
import RequireStaff from "./components/app/RequireStaff";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Site public */}
        <Route path="/" element={<Index />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* App connectée */}
        <Route path="/app" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/app/acheter" element={<RequireAuth><AppAcheter /></RequireAuth>} />
        <Route path="/app/vendre" element={<RequireAuth><AppVendre /></RequireAuth>} />
        <Route path="/app/envoyer" element={<RequireAuth><Envoyer /></RequireAuth>} />
        <Route path="/app/otc" element={<RequireAuth><AppOTC /></RequireAuth>} />
        <Route path="/app/compte" element={<RequireAuth><Compte /></RequireAuth>} />

        {/* Back-office — réservé à l'équipe (rôles dans user_roles) */}
        <Route path="/admin" element={<RequireStaff><AdminPortal /></RequireStaff>} />

        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
