import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ── Tipos ────────────────────────────────────────────────────────────────────
type SportKey = "Beach Tênis" | "Vôlei" | "Futsal" | "Futebol" | "Futebol Society";

interface SportDataItem {
  name: string;
  value: number;
  color: string;
}

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

// ── Paleta ───────────────────────────────────────────────────────────────────
const SPORT_COLORS: Record<SportKey, string> = {
  "Beach Tênis": "#3B82F6",
  "Vôlei": "#EF4444",
  "Futsal": "#EAB308",
  "Futebol": "#22C55E",
  "Futebol Society": "#A855F7",
};
const SPORT_KEYS = Object.keys(SPORT_COLORS) as SportKey[];

// ── Dados ────────────────────────────────────────────────────────────────────
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const weeklyData = [
  { semana: "1-7",   agendamentos: 12 },
  { semana: "8-14",  agendamentos: 8 },
  { semana: "15-21", agendamentos: 9 },
  { semana: "22-28", agendamentos: 5 },
  { semana: "29-31", agendamentos: 3 },
];

const sportsFaturamento: SportDataItem[] = [
  { name: "Beach Tênis",     value: 1140, color: SPORT_COLORS["Beach Tênis"] },
  { name: "Futebol",         value: 860,  color: SPORT_COLORS["Futebol"] },
  { name: "Futebol Society", value: 530,  color: SPORT_COLORS["Futebol Society"] },
  { name: "Vôlei",           value: 440,  color: SPORT_COLORS["Vôlei"] },
  { name: "Futsal",          value: 240,  color: SPORT_COLORS["Futsal"] },
];

const sportsAgendamentos: SportDataItem[] = [
  { name: "Beach Tênis",     value: 11, color: SPORT_COLORS["Beach Tênis"] },
  { name: "Futebol",         value: 3,  color: SPORT_COLORS["Futebol"] },
  { name: "Futebol Society", value: 2,  color: SPORT_COLORS["Futebol Society"] },
  { name: "Vôlei",           value: 9,  color: SPORT_COLORS["Vôlei"] },
  { name: "Futsal",          value: 4,  color: SPORT_COLORS["Futsal"] },
];

const monthlyStackedData: Array<{ mes: string } & Record<SportKey, number>> = [
  { mes: "Jan", "Beach Tênis": 10, Vôlei: 5,  Futsal: 3, Futebol: 4,  "Futebol Society": 2 },
  { mes: "Fev", "Beach Tênis": 12, Vôlei: 6,  Futsal: 4, Futebol: 3,  "Futebol Society": 3 },
  { mes: "Mar", "Beach Tênis": 8,  Vôlei: 4,  Futsal: 2, Futebol: 3,  "Futebol Society": 2 },
  { mes: "Abr", "Beach Tênis": 9,  Vôlei: 5,  Futsal: 3, Futebol: 4,  "Futebol Society": 2 },
  { mes: "Mai", "Beach Tênis": 7,  Vôlei: 3,  Futsal: 2, Futebol: 2,  "Futebol Society": 1 },
  { mes: "Jun", "Beach Tênis": 11, Vôlei: 6,  Futsal: 4, Futebol: 5,  "Futebol Society": 3 },
  { mes: "Jul", "Beach Tênis": 9,  Vôlei: 5,  Futsal: 3, Futebol: 4,  "Futebol Society": 2 },
  { mes: "Ago", "Beach Tênis": 15, Vôlei: 8,  Futsal: 5, Futebol: 7,  "Futebol Society": 5 },
  { mes: "Set", "Beach Tênis": 10, Vôlei: 5,  Futsal: 3, Futebol: 4,  "Futebol Society": 2 },
  { mes: "Out", "Beach Tênis": 12, Vôlei: 6,  Futsal: 4, Futebol: 5,  "Futebol Society": 3 },
  { mes: "Nov", "Beach Tênis": 11, Vôlei: 5,  Futsal: 3, Futebol: 4,  "Futebol Society": 2 },
  { mes: "Dez", "Beach Tênis": 20, Vôlei: 12, Futsal: 8, Futebol: 15, "Futebol Society": 10 },
];

const monthlyFaturamento = [
  { mes: "Jan", valor: 2600 }, { mes: "Fev", valor: 1500 }, { mes: "Mar", valor: 1400 },
  { mes: "Abr", valor: 1300 }, { mes: "Mai", valor: 1200 }, { mes: "Jun", valor: 2800 },
  { mes: "Jul", valor: 5500 }, { mes: "Ago", valor: 2000 }, { mes: "Set", valor: 1800 },
  { mes: "Out", valor: 1700 }, { mes: "Nov", valor: 1600 }, { mes: "Dez", valor: 7800 },
];

const monthlyAgendamentos = [
  { mes: "Jan", valor: 24 }, { mes: "Fev", valor: 55 }, { mes: "Mar", valor: 15 },
  { mes: "Abr", valor: 14 }, { mes: "Mai", valor: 13 }, { mes: "Jun", valor: 55 },
  { mes: "Jul", valor: 14 }, { mes: "Ago", valor: 13 }, { mes: "Set", valor: 15 },
  { mes: "Out", valor: 25 }, { mes: "Nov", valor: 14 }, { mes: "Dez", valor: 78 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const BRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

// ── Componentes ──────────────────────────────────────────────────────────────
function Trend({ value, positive }: TrendProps) {
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-green-500" : "text-red-400"}`}>
      {positive ? "▲" : "▼"} {value}%
      <span className="text-gray-400 font-normal">vs mês anterior</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? "#111" }}>
          {p.name ? `${p.name}: ` : ""}{prefix}{typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

// Donut SVG customizado (mesmo padrão da Academia)
function DonutChart({ data, label }: { data: SportDataItem[]; label: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 44, cx = 56, cy = 56, stroke = 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
      <p className="text-xs font-medium text-gray-400 text-center mb-1">Esportes</p>
      <p className="text-[10px] text-gray-400 text-center mb-3">{label}</p>
      <svg width="112" height="112" viewBox="0 0 112 112">
        {data.map((seg, i) => {
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
      <div className="flex flex-col gap-1 w-full mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span>{d.name}</span>
            <span className="ml-auto font-semibold text-gray-700">
              {d.value > 100 ? BRL(d.value) : d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function FinanceiroQuadras() {
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

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-4 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 mb-3">Faturamento</p>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">R$ 2.200,00</p>
          <Trend value="4,5" positive={true} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 mb-3">Agendamentos</p>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">37</p>
          <Trend value="11,5" positive={true} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 mb-3">Quadra mais alugada</p>
          <p className="text-2xl font-extrabold text-gray-900">Quadra 01</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 mb-3">Clientes</p>
          <p className="text-2xl font-extrabold text-gray-900 mb-2">21</p>
          <Trend value="1,8" positive={false} />
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-3 gap-5 mb-8">

        {/* Agendamentos por Semana */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 text-center mb-3">Agendamentos por Semana</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} barSize={24}>
              <XAxis dataKey="semana" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" agendamentos" />} />
              <Bar dataKey="agendamentos" radius={[4, 4, 0, 0]}>
                {weeklyData.map((_, i) => <Cell key={i} fill="#2563eb" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Faturamento */}
        <DonutChart data={sportsFaturamento} label="Faturamento" />

        {/* Donut Agendamentos */}
        <DonutChart data={sportsAgendamentos} label="Agendamentos" />
      </div>

      {/* ── YEAR NAVIGATOR ── */}
      <div className="flex items-center justify-center gap-5 mb-6">
        <button onClick={() => setDisplayYear(y => y - 1)} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">‹</button>
        <h2 className="text-green-800 font-extrabold text-xl w-20 text-center">{displayYear}</h2>
        <button onClick={() => setDisplayYear(y => y + 1)} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center text-green-800 text-xl transition-colors">›</button>
      </div>

      {/* ── ANNUAL CHARTS ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Agendamentos de esportes por mês (stacked) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-5">Agendamentos de esportes por mês</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyStackedData} barSize={20}>
              <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              {SPORT_KEYS.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={SPORT_COLORS[key]}
                  radius={key === "Futebol Society" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 justify-center">
            {SPORT_KEYS.map(k => (
              <div key={k} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: SPORT_COLORS[k] }} />
                {k}
              </div>
            ))}
          </div>
        </div>

        {/* Faturamento por mês */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-5">Faturamento por mês</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyFaturamento} barSize={24}>
              <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip prefix="R$ " />}
              />
              <Bar dataKey="valor" radius={[5, 5, 0, 0]}>
                {monthlyFaturamento.map((_, i) => (
                  <Cell key={i} fill={i === 11 ? "#1d4ed8" : "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agendamentos por mês */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-5">Agendamentos por mês</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyAgendamentos} barSize={24}>
              <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" agendamentos" />} />
              <Bar dataKey="valor" radius={[5, 5, 0, 0]}>
                {monthlyAgendamentos.map((_, i) => (
                  <Cell key={i} fill={i === 11 ? "#1d4ed8" : "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}