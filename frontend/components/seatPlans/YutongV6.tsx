import React from 'react';
import { Frame, Row2x1, TOP_MARGIN, SEAT_H, ROW_GAP, width2x1, SIDE_MARGIN } from './SeatPlanBase';

// Indicative layout for a 15-seat configuration of the Yutong V6 (minivan):
// five 2+1 rows, matching Yutong's published "14/15 seats" spec for this
// model. Not an official Yutong cabin diagram.
const ROWS = 5;

const YutongV6: React.FC = () => {
  const width = width2x1();
  const height = TOP_MARGIN + ROWS * (SEAT_H + ROW_GAP) + 24;
  const doorX = width - SIDE_MARGIN - 30;

  return (
    <Frame width={width} height={height} frontDoorX={doorX}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <Row2x1 key={i} row={i} rowLabel={String(i + 1)} />
      ))}
    </Frame>
  );
};

export default YutongV6;
