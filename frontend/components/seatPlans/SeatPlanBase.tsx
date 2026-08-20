import React from 'react';

export const SEAT_W = 26;
export const SEAT_H = 22;
export const ROW_GAP = 8;
export const AISLE_W = 20;
export const SIDE_MARGIN = 24;
export const TOP_MARGIN = 70;

interface SeatProps {
  x: number;
  y: number;
  label?: string;
}

export const Seat: React.FC<SeatProps> = ({ x, y, label }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={SEAT_W}
      height={SEAT_H}
      rx={5}
      fill="var(--brand-dark)"
      fillOpacity={0.12}
      stroke="var(--brand-dark)"
      strokeOpacity={0.5}
      strokeWidth={1}
    />
    <rect x={x + 3} y={y + 3} width={SEAT_W - 6} height={6} rx={2} fill="var(--brand-dark)" fillOpacity={0.3} />
    {label && (
      <text x={x + SEAT_W / 2} y={y + SEAT_H - 5} textAnchor="middle" fontSize="7" fill="var(--brand-dark)" fontWeight={700}>
        {label}
      </text>
    )}
  </g>
);

export function rowY(rowIndex: number): number {
  return TOP_MARGIN + rowIndex * (SEAT_H + ROW_GAP);
}

export function width2x2(): number {
  return SIDE_MARGIN + (2 * SEAT_W + 3) + AISLE_W + (2 * SEAT_W + 3) + SIDE_MARGIN;
}

export function width2x1(): number {
  return SIDE_MARGIN + (2 * SEAT_W + 3) + AISLE_W + SEAT_W + SIDE_MARGIN;
}

/** A row with 2 seats left of the aisle and 2 right (standard coach layout). */
export const Row2x2: React.FC<{ row: number; rowLabel: string }> = ({ row, rowLabel }) => {
  const y = rowY(row);
  const x1 = SIDE_MARGIN;
  const x2 = x1 + SEAT_W + 3;
  const x3 = x2 + SEAT_W + AISLE_W;
  const x4 = x3 + SEAT_W + 3;
  return (
    <>
      <Seat x={x1} y={y} label={`${rowLabel}A`} />
      <Seat x={x2} y={y} label={`${rowLabel}B`} />
      <Seat x={x3} y={y} label={`${rowLabel}C`} />
      <Seat x={x4} y={y} label={`${rowLabel}D`} />
    </>
  );
};

/** A row with 2 seats left of the aisle and 1 right (VIP coach layout). */
export const Row2x1: React.FC<{ row: number; rowLabel: string }> = ({ row, rowLabel }) => {
  const y = rowY(row);
  const x1 = SIDE_MARGIN;
  const x2 = x1 + SEAT_W + 3;
  const x3 = x2 + SEAT_W + AISLE_W;
  return (
    <>
      <Seat x={x1} y={y} label={`${rowLabel}A`} />
      <Seat x={x2} y={y} label={`${rowLabel}B`} />
      <Seat x={x3} y={y} label={`${rowLabel}C`} />
    </>
  );
};

export const RearBlock: React.FC<{ row: number; width: number; label: string }> = ({ row, width, label }) => {
  const y = rowY(row);
  return (
    <g>
      <rect
        x={SIDE_MARGIN}
        y={y}
        width={width - 2 * SIDE_MARGIN}
        height={SEAT_H}
        rx={5}
        fill="var(--brand-accent)"
        fillOpacity={0.15}
        stroke="var(--brand-accent)"
        strokeOpacity={0.6}
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <text x={width / 2} y={y + SEAT_H / 2 + 3} textAnchor="middle" fontSize="8" fontWeight={700} fill="var(--brand-accent)">
        {label}
      </text>
    </g>
  );
};

export const Frame: React.FC<{ width: number; height: number; children: React.ReactNode; frontDoorX?: number }> = ({
  width,
  height,
  children,
  frontDoorX,
}) => (
  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Plan des sièges">
    {/* Body outline */}
    <rect x={4} y={4} width={width - 8} height={height - 8} rx={26} fill="#F7F5FB" stroke="var(--brand-dark)" strokeOpacity={0.35} strokeWidth={2} />
    {/* Windshield / front indicator */}
    <path d={`M 4 40 Q ${width / 2} 8 ${width - 4} 40`} fill="none" stroke="var(--brand-dark)" strokeOpacity={0.35} strokeWidth={2} />
    <text x={width / 2} y={26} textAnchor="middle" fontSize="10" fontWeight={800} fill="var(--brand-dark)" letterSpacing="1">
      AVANT
    </text>
    {/* Front door */}
    {frontDoorX != null && (
      <>
        <rect x={frontDoorX} y={44} width={30} height={6} rx={3} fill="var(--brand-dark)" fillOpacity={0.5} />
        <text x={frontDoorX + 15} y={40} textAnchor="middle" fontSize="7" fill="var(--brand-dark)" fillOpacity={0.7}>
          Porte
        </text>
      </>
    )}
    {children}
  </svg>
);
