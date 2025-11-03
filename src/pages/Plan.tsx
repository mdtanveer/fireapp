import { Grid } from '@mantine/core';
import React from 'react';
import { Inputs } from './Inputs';

export function Plan() {
  // For now reuse Inputs layout as combined planner; could be specialized later
  return (
    <Grid>
      <Inputs />
    </Grid>
  );
}


