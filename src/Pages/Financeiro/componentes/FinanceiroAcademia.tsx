import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const weekData = [
  { week: "1-7",   renovacoes: 12 },
  { week: "8-14",  renovacoes: 8 },
  { week: "15-21", renovacoes: 9 },
  { week: "22-28", renovacoes: 5 },
  { week: "29-31", renovacoes: 3 },
];

const annualRevenue = [
  { mes: "Jan", valor: 2500 },
  { mes: "Fev", valor: 1600 },
  { mes: "Mar", valor: 3200 },
  { mes: "Abr", valor: 2800 },
  { mes: "Mai", valor: 1900 },
  { mes: "Jun", valor: 1600 },
  { mes: "Jul", valor: 5200 },
  { mes: "Ago", valor: 2600 },
  { mes: "Set", valor: 1900 },
  { mes: "Out", valor: 2100 },
  { mes: "Nov", valor: 2000 },
  { mes: "Dez", valor: 7800 },
];

const annualStudents = [
  { mes: "Jan", alunos: 26 },
  { mes: "Fev", alunos: 62 },
  { mes: "Mar", alunos: 14 },
  { mes: "Abr", alunos: 28 },
  { mes: "Mai", alunos: 14 },
  { mes: "Jun", alunos: 15 },
  { mes: "Jul", alunos: 60 },
  { mes: "Ago", alunos: 58 },
  { mes: "Set", alunos: 15 },
  { mes: "Out", alunos: 18 },
  { mes: "Nov", alunos: 17 },
  { mes: "Dez", alunos: 78 },
];

const donutData = [
  { label: "Alunos Ativos",    value: 37, color: "#4ade80" },
  { label: "Alunos Expirados", value: 15, color: "#f97316" },
  { label: "Alunos Inativos",  value: 6,  color: "#eab308" },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
}

interface TrendProps {
  value: string;
  positive: boolean;
  label?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}

// ─── DONUT SVG ────────────────────────────────────────────────────────────────
function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 44, cx = 56, cy = 56, stroke = 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
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
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TREND BADGE ─────────────────────────────────────────────────────────────
function Trend({ value, positive, label = "vs mês anterior" }: TrendProps) {
  return (
    <div className={`flex items-center justify-center gap-1 text-xs font-semibold ${positive ? "text-green-500" : "text-red-400"}`}>
      {positive ? "▲" : "▼"} {value}%
      <span className="text-gray-400 font-normal">{label}</span>
    </div>
  );
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-bold text-gray-800">{prefix}{payload[0].value.toLocaleString("pt-BR")}{suffix}</p>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FinanceiroAcademia() {
  const [monthIdx, setMonthIdx] = useState(11);
  const [year, setYear] = useState(2026);
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
    <div className="min-h-screen bg-gray-50 font-sans">

      <main className="max-w-6xl mx-auto px-6 py-8">

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

          {/* Faturamento */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 text-center mb-3">Faturamento</p>
            <p className="text-3xl font-extrabold text-gray-900 text-center mb-2">R$ 2.200,00</p>
            <Trend value="4,5" positive={true} />
          </div>

          {/* Renovações por Semana */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 text-center mb-3">Renovações por Semana</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={weekData} barSize={22}>
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip suffix=" renovações" />} />
                <Bar dataKey="renovacoes" radius={[4, 4, 0, 0]}>
                  {weekData.map((_, i) => <Cell key={i} fill="#2563eb" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status dos Alunos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
            <p className="text-xs font-medium text-gray-400 text-center mb-3">Status dos Alunos</p>
            <DonutChart data={donutData} />
          </div>
        </div>

        {/* ── SUB KPIs ── */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-xs font-medium text-gray-400 mb-2">Alunos Ativos</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-1.5">37</p>
            <Trend value="11,5" positive={true} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-xs font-medium text-gray-400 mb-2">Outros Alunos</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-1.5">21</p>
            <Trend value="1,9" positive={false} />
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

          {/* Faturamento por mês */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-700 text-center mb-5">Faturamento por mês</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={annualRevenue} barSize={28}>
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="R$ " />} />
                <Bar dataKey="valor" radius={[5, 5, 0, 0]}>
                  {annualRevenue.map((_, i) => (
                    <Cell key={i} fill={i === 11 ? "#1d4ed8" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alunos Ativos por Mês */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-700 text-center mb-5">Alunos Ativos por Mês</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={annualStudents} barSize={28}>
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip suffix=" alunos" />} />
                <Bar dataKey="alunos" radius={[5, 5, 0, 0]}>
                  {annualStudents.map((_, i) => (
                    <Cell key={i} fill={i === 11 ? "#1d4ed8" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
    </div>
  );
}