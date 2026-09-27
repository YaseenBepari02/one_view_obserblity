"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  delay?: number;
  icon?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  color,
  delay = 0,
  icon,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: "var(--ov-bg-card)"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: "var(--ov-text-muted)", margin: 0 }}>
          {title}
        </h4>
        {icon && (
          <div
            style={{ width: '24px', height: '24px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}20`, color }}
          >
            {icon}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-0.025em', color: "var(--ov-text-primary)", margin: 0 }}>
          {value}
        </div>
        <div style={{ fontSize: '10px', marginTop: '4px', color: "var(--ov-text-muted)" }}>
          {subtitle}
        </div>
      </div>
    </motion.div>
  );
}
