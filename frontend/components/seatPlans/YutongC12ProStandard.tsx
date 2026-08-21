import React from 'react';
import { DoorMarker, Frame, Row2x2, RearBench, TOP_MARGIN, SEAT_H, ROW_GAP, rowY, width2x2, SIDE_MARGIN } from './SeatPlanBase';

// Layout for the Yutong C12 Pro Standard — chassis ZK6120D1 (without ambient
// LED lighting): 51 passenger seats — twelve 2+2 rows (48 seats) plus a
// widened, full-width 3-seat rear bench — plus 2 separate crew seats (driver
// + second crew member) at the front and two doors (front, and a second
// further along the side), matching the owner's on-site seating sketch. This
// is the lower-capacity of the two C12 Pro Standard chassis Nagode operates;
// see YutongC12ProStandardLED for the 52-seat ZK6129D variant. Reconstructed
// from the sketch and the owner's description, not an official Yutong cabin
// diagram.
const ROWS = 12;
const BENCH_ROW = ROWS;
const MID_DOOR_ROW = 6;

const YutongC12ProStandard: React.FC = () => {
  const width = width2x2();
  const height = TOP_MARGIN + (ROWS + 1) * (SEAT_H + ROW_GAP) + 24;
  const door1X = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={door1X} driverSide="left" crewSide="right">
      <DoorMarker x={door1X} y={rowY(MID_DOOR_ROW) - 10} />
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x2 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <RearBench row={BENCH_ROW} width={width} count={3} rowLabel={String(BENCH_ROW + 1)} />
    </Frame>
  );
};

export default YutongC12ProStandard;
