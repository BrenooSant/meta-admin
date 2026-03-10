import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "../pages/Login/LoginPage";
import { AgendamentosPage } from "../pages/Agendamentos/AgendamentosPage";
import { AcademiaPage } from "../pages/Academia/AcademiaPage";
import { FinanceiroPage } from "../pages/Financeiro/FinanceiroPage";
import { ConfiguracoesPage } from "../pages/Configuraçoes/ConfiguracoesPage";
import { MainLayout } from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route element={<MainLayout />}>
          <Route path="/agendamentos" element={<AgendamentosPage />} />
          <Route path="/academia" element={<AcademiaPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;