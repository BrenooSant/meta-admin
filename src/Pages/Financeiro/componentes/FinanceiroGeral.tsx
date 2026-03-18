import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const weekData = [
  { week: "1-7",   faturamento: 12 },
  { week: "8-14",  faturamento: 8 },
  { week: "15-21", faturamento: 9 },
  { week: "22-28", faturamento: 5 },
  { week: "29-31", faturamento: 3 },
];

const donutData = [
  { name: "Quadras (R$ 2500)", value: 2500, color: "#1e3a5f" },
  { name: "Academia (R$ 2000)", value: 2000, color: "#4ade80" },
];

// Faturamento total por mês (soma quadras + academia)
const annualTotal = [
  { mes: "Jan", total: 4100 },
  { mes: "Fev", total: 2800 },
  { mes: "Mar", total: 5000 },
  { mes: "Abr", total: 4600 },
  { mes: "Mai", total: 3200 },
  { mes: "Jun", total: 2900 },
  { mes: "Jul", total: 7800 },
  { mes: "Ago", total: 4400 },
  { mes: "Set", total: 3200 },
  { mes: "Out", total: 3500 },
  { mes: "Nov", total: 3400 },
  { mes: "Dez", total: 9800 },
];

// Faturamento segmentado por mês
const annualSegmented = [
  { mes: "Jan", quadras: 1600, academia: 2500 },
  { mes: "Fev", quadras: 1200, academia: 1600 },
  { mes: "Mar", quadras: 1800, academia: 3200 },
  { mes: "Abr", quadras: 1800, academia: 2800 },
  { mes: "Mai", quadras: 1300, academia: 1900 },
  { mes: "Jun", quadras: 1300, academia: 1600 },
  { mes: "Jul", quadras: 2600, academia: 5200 },
  { mes: "Ago", quadras: 1800, academia: 2600 },
  { mes: "Set", quadras: 1300, academia: 1900 },
  { mes: "Out", quadras: 1400, academia: 2100 },
  { mes: "Nov", quadras: 1400, academia: 2000 },
  { mes: "Dez", quadras: 2000, academia: 7800 },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; color?: string }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}

interface TrendProps {
  value: string;
  positive: boolean;
}

// ─── TREND ───────────────────────────────────────────────────────────────────
function Trend({ value, positive }: TrendProps) {
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-green-500" : "text-red-400"}`}>
      {positive ? "▲" : "▼"} {value}%
      <span className="text-gray-400 font-normal">vs mês anterior</span>
    </div>
  );
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? "#111" }}>
          {p.name ? `${p.name}: ` : ""}{prefix}{p.value.toLocaleString("pt-BR")}{suffix}
        </p>
      ))}
    </div>
  );
}

// ─── DONUT ───────────────────────────────────────────────────────────────────
function DonutSegmentos() {
  const total = donutData.reduce((s, d) => s + d.value, 0);
  const r = 44, cx = 56, cy = 56, stroke = 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="112" height="112" viewBox="0 0 112 112">
        {donutData.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          );
          offset += dash;
          return el;
        })}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {donutData.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FinanceiroGeral() {
  const [monthIdx, setMonthIdx] = useState(11);
  const [year, setYear]         = useState(2026);
  const [displayYear, setDisplayYear] = useState(2026);

  const prevMonth = () => {
    if (monthIdx === 0) { setMonthIdx(11); setYear(y => y - 1); }
    else setMonthIdx(m => m - 1);
  };

  const nextMonth = () => {
    if (monthIdx === 11) { setMonthIdx(0); setYear(y => y + 1); }
    else setMonthIdx(m => m + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* ── MONTH NAVIGATOR ── */}
      <div className="flex items-center justify-center gap-5 mb-6">
        <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">‹</button>
        <h2 className="text-green-800 font-extrabold text-xl w-52 text-center">
          {MONTHS[monthIdx]}/{year}
        </h2>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">›</button>
      </div>

      {/* ── KPI ROW ── */}
      <div className="grid grid-cols-3 gap-5 mb-5">

        {/* Faturamento + sub KPIs */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 text-center mb-3">Faturamento</p>
            <p className="text-3xl font-extrabold text-gray-900 text-center mb-2">R$ 2.200,00</p>
            <Trend value="4,5" positive={true} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-xs font-medium text-gray-400 mb-2">Alunos Ativos</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">37</p>
              <Trend value="11,5" positive={true} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-xs font-medium text-gray-400 mb-2">Agendamentos</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">37</p>
              <Trend value="11,5" positive={true} />
            </div>
          </div>
        </div>

        {/* Faturamento por Semana */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 text-center mb-3">Faturamento por Semana</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} barSize={24}>
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Bar dataKey="faturamento" radius={[4, 4, 0, 0]}>
                {weekData.map((_, i) => <Cell key={i} fill="#2563eb" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faturamento Segmentos Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
          <p className="text-xs font-medium text-gray-400 text-center mb-1">Faturamento</p>
          <p className="text-[10px] text-gray-400 text-center mb-3">Segmentos</p>
          <DonutSegmentos />
        </div>
      </div>

      {/* ── YEAR NAVIGATOR ── */}
      <div className="flex items-center justify-center gap-5 mb-6">
        <button onClick={() => setDisplayYear(y => y - 1)} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">‹</button>
        <h2 className="text-green-800 font-extrabold text-xl w-20 text-center">{displayYear}</h2>
        <button onClick={() => setDisplayYear(y => y + 1)} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">›</button>
      </div>

      {/* ── ANNUAL CHARTS ── */}
      <div className="grid grid-cols-2 gap-5">

        {/* Faturamento Total por Mês */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-5">Faturamento Total por Mês</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={annualTotal} barSize={28}>
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                {annualTotal.map((_, i) => (
                  <Cell key={i} fill={i === 11 ? "#1d4ed8" : "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faturamento Total por Mês — Segmentado */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-1">Faturamento Total por Mês</p>
          <p className="text-xs text-gray-400 text-center mb-4">Segmentos</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={annualSegmented} barSize={20}>
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Bar dataKey="quadras" name="Quadras" stackId="a" fill="#1e3a5f" radius={[0, 0, 0, 0]} />
              <Bar dataKey="academia" name="Academia" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm bg-[#1e3a5f]" /> Quadras
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm bg-[#4ade80]" /> Academia
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}