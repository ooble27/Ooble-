import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Acheter from "./pages/Acheter";
import Vendre from "./pages/Vendre";
import Connexion from "./pages/Connexion";
import Dashboard from "./pages/app/Dashboard";
import AppAcheter from "./pages/app/AppAcheter";
import AppVendre from "./pages/app/AppVendre";
import Envoyer from "./pages/app/Envoyer";
import Compte from "./pages/app/Compte";
import RequireAuth from "./components/app/RequireAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Site public */}
        <Route path="/" element={<Index />} />
        <Route path="/acheter" element={<Acheter />} />
        <Route path="/vendre" element={<Vendre />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* App connectée */}
        <Route path="/app" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/app/acheter" element={<RequireAuth><AppAcheter /></RequireAuth>} />
        <Route path="/app/vendre" element={<RequireAuth><AppVendre /></RequireAuth>} />
        <Route path="/app/envoyer" element={<RequireAuth><Envoyer /></RequireAuth>} />
        <Route path="/app/compte" element={<RequireAuth><Compte /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
