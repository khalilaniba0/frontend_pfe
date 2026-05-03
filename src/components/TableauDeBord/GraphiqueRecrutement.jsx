import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  Chart,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function HiringChart({ data, loading }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const chartData = useMemo(
    function () {
      return (
        data || {
          labels: [],
          candidatures: [],
          pourvus: [],
          tauxConversion: [],
        }
      );
    },
    [data]
  );

  // KPI calculés
  const totalCandidatures = chartData
    ? chartData.candidatures.reduce(function (a, b) { return a + b; }, 0)
    : 0;
  const totalPourvus = chartData
    ? chartData.pourvus.reduce(function (a, b) { return a + b; }, 0)
    : 0;
  const tauxMoyen = chartData && chartData.tauxConversion.length > 0
    ? Math.round(
        chartData.tauxConversion.reduce(function (a, b) { return a + b; }, 0) /
          chartData.tauxConversion.length
      )
    : 0;

  useEffect(
    function () {
      if (!chartRef.current || !chartData || chartData.labels.length === 0) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }
        return;
      }

      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Création de dégradés pour un look moderne
      const gradCandidatures = ctx.createLinearGradient(0, 0, 0, 400);
      gradCandidatures.addColorStop(0, "rgba(0, 102, 204, 0.3)");
      gradCandidatures.addColorStop(1, "rgba(0, 102, 204, 0.0)");

      const gradPourvus = ctx.createLinearGradient(0, 0, 0, 400);
      gradPourvus.addColorStop(0, "rgba(210, 210, 215, 0.4)");
      gradPourvus.addColorStop(1, "rgba(210, 210, 215, 0.0)");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              type: "line",
              label: "Candidatures reçues",
              data: chartData.candidatures,
              borderColor: "#0066cc",
              backgroundColor: gradCandidatures,
              borderWidth: 3,
              fill: true,
              tension: 0.4, // Courbe douce
              pointRadius: 0,
              pointHoverRadius: 6,
              yAxisID: "y",
            },
            {
              type: "line",
              label: "Postes pourvus",
              data: chartData.pourvus,
              borderColor: "#d2d2d7",
              backgroundColor: gradPourvus,
              borderWidth: 3,
              fill: true,
              tension: 0.4, // Courbe douce
              pointRadius: 0,
              pointHoverRadius: 6,
              yAxisID: "y",
            },
            {
              type: "line",
              label: "Taux de conversion %",
              data: chartData.tauxConversion,
              borderColor: "#7a7a7a",
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [5, 5], // Ligne pointillée
              pointBackgroundColor: "#fff",
              pointBorderColor: "#7a7a7a",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: false,
              tension: 0.4,
              yAxisID: "y2",
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              titleFont: {
                family: "SF Pro Text, system-ui, sans-serif",
                size: 13,
                weight: "600",
              },
              bodyFont: {
                family: "SF Pro Text, system-ui, sans-serif",
                size: 12,
              },
              padding: 12,
              cornerRadius: 12,
              displayColors: true,
              boxWidth: 10,
              boxHeight: 10,
              boxPadding: 4,
              callbacks: {
                label: function (context) {
                  if (context.dataset.label === "Taux de conversion %") {
                    return " " + context.dataset.label + " : " + context.parsed.y + "%";
                  }
                  return " " + context.dataset.label + " : " + context.parsed.y;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: "#94a3b8",
                font: {
                  family: "SF Pro Text, system-ui, sans-serif",
                  size: 12,
                  weight: "500",
                },
                padding: 10,
              },
              border: { display: false },
            },
            y: {
              type: "linear",
              position: "left",
              beginAtZero: true,
              grid: { 
                color: "#f8fafc",
                drawBorder: false,
              },
              border: { display: false, dash: [4, 4] },
              ticks: {
                color: "#94a3b8",
                font: { family: "Inter, sans-serif", size: 11 },
                padding: 12,
                maxTicksLimit: 6,
              },
            },
            y2: {
              type: "linear",
              position: "right",
              beginAtZero: true,
              max: 100,
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: "#cbd5e1",
                font: { family: "Inter, sans-serif", size: 11 },
                callback: function (value) {
                  return value + "%";
                },
                padding: 12,
              },
            },
          },
        },
      });

      return function () {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    },
    [chartData]
  );

  return (
    <div className="apple-card flex h-64 sm:h-80 lg:h-[380px] flex-col">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-text text-[17px] font-semibold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.374px' }}>
            Aperçu des recrutements
          </h3>
          <p className="mt-0.5 font-text text-[12px]" style={{ color: 'var(--color-ink-muted-48)' }}>
            6 derniers mois
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#0066cc' }}></span>
            <span className="font-text text-[12px]" style={{ color: 'var(--color-ink-muted-48)' }}>Candidatures</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#d2d2d7' }}></span>
            <span className="font-text text-[12px]" style={{ color: 'var(--color-ink-muted-48)' }}>Pourvus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#7a7a7a' }}></span>
            <span className="font-text text-[12px]" style={{ color: 'var(--color-ink-muted-48)' }}>Conversion</span>
          </div>
        </div>
      </header>

      {/* KPI Pills */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="badge-count inline-flex items-center gap-1.5 font-text text-[12px] font-semibold" style={{ color: 'var(--color-primary)' }}>
          <span className="material-symbols-outlined text-sm">inbox</span>
          {loading ? "…" : totalCandidatures} Candidatures
        </span>
        <span className="badge-count inline-flex items-center gap-1.5 font-text text-[12px] font-semibold" style={{ color: 'var(--color-ink-muted-48)' }}>
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {loading ? "…" : totalPourvus} Pourvus
        </span>
        <span className="badge-count inline-flex items-center gap-1.5 font-text text-[12px] font-semibold" style={{ color: 'var(--color-ink-muted-80)' }}>
          <span className="material-symbols-outlined text-sm">trending_up</span>
          {loading ? "…" : tauxMoyen}% Conversion
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-text-muted">Chargement du graphique...</p>
          </div>
        ) : !chartData?.labels?.length ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-text-muted">Aucune donnee disponible</p>
          </div>
        ) : (
          <canvas ref={chartRef}></canvas>
        )}
      </div>
    </div>
  );
}

HiringChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    candidatures: PropTypes.arrayOf(PropTypes.number),
    pourvus: PropTypes.arrayOf(PropTypes.number),
    tauxConversion: PropTypes.arrayOf(PropTypes.number),
  }),
  loading: PropTypes.bool,
};

HiringChart.defaultProps = {
  data: null,
  loading: false,
};
