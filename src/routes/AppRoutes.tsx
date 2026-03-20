import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "../pages/Login/LoginPage";
import { AgendamentosPage } from "../pages/Agendamentos/AgendamentosPage";
import { AcademiaPage } from "../pages/Academia/AcademiaPage";
import { FinanceiroPage } from "../pages/Financeiro/FinanceiroPage";
import { ConfiguracoesPage } from "../pages/Configuraçoes/ConfiguracoesPage";
import { ComprovantePage } from "../pages/Comprovante/ComprovantePage"
import { GerenciarHorariosPage } from "../pages/GerenciarHorarios/GerenciarHorariosPage";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthRedirect } from "./components/AuthRedirect";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/academia" element={<AcademiaPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            <Route path="/configuracoes/horarios" element={<GerenciarHorariosPage />} />
          </Route>
        </Route>

        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/comprovante" element={<ComprovantePage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;