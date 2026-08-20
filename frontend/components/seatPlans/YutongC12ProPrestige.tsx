import React from 'react';
import { Frame, Row2x1, RearBlock, TOP_MARGIN, SEAT_H, ROW_GAP, width2x1, SIDE_MARGIN } from './SeatPlanBase';

// Indicative layout for the Prestige configuration of the Yutong C12 Pro:
// a 2+1 VIP layout (fewer, wider seats than the Standard configuration)
// with an onboard toilet at the rear, in place of some seats. Capacity is
// not confirmed for this configuration, so no exact seat count is printed —
// this diagram represents a plausible arrangement for a 12m coach fitted
// with a toilet, not an official Yutong cabin diagram.
const ROWS = 10;

const YutongC12ProPrestige: React.FC = () => {
  const width = width2x1();
  const height = TOP_MARGIN + (ROWS + 1.4) * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={doorX}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x1 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
      <RearBlock row={ROWS} width={width} label="Toilettes" />
    </Frame>
  );
};

export default YutongC12ProPrestige;
