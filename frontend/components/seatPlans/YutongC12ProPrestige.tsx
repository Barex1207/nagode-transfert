import React from 'react';
import { Frame, Row2x1, RearBlock, Seat, SIDE_MARGIN, TOP_MARGIN, SEAT_H, SEAT_W, ROW_GAP, rowY, width2x1 } from './SeatPlanBase';

// Layout for the Yutong C12 Pro Prestige: 25 passenger seats in a 2+1 VIP
// configuration (wide reclining individual seats, single column on one
// side) — eight rows (24 seats) plus one extra individual seat — plus 2
// separate crew seats (driver + second crew member) at the front, and a
// combined rear zone that serves as both the toilet and the rear entry, as
// described by the owner. The passenger-seat count (25) is fixed here; the
// vehicle's capacity field in the admin is managed separately by the owner.
// Reconstructed from the sketch and the owner's description — including a
// reference video confirming leather reclining seats with footrests and
// individual armrest screens — not an official Yutong cabin diagram.
const ROWS = 8;
const EXTRA_SEAT_ROW = ROWS;
const REAR_ZONE_ROW = ROWS + 1;

const YutongC12ProPrestige: React.FC = () => {
  const width = width2x1();
  const height = TOP_MARGIN + (ROWS + 2.4) * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;
  const extraSeatX = width - SIDE_MARGIN - SEAT_W;

  return (
    <Frame width={width} height={height} frontDoorX={doorX} driverSide="left" crewSide="right">
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x1 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <Seat x={extraSeatX} y={rowY(EXTRA_SEAT_ROW)} label={`${EXTRA_SEAT_ROW + 1}A`} />
      <RearBlock row={REAR_ZONE_ROW} width={width} label="Toilettes / Entrée arrière" />
    </Frame>
  );
};

export default YutongC12ProPrestige;
