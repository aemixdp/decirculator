export type SimulationAction = StartSimulation | PauseSimulation | StopSimulation;

export type StartSimulation = { type: 'START_SIMULATION' };
export type PauseSimulation = { type: 'PAUSE_SIMULATION' };
export type StopSimulation = { type: 'STOP_SIMULATION' };

export const start: StartSimulation = { type: 'START_SIMULATION' };
export const pause: PauseSimulation = { type: 'PAUSE_SIMULATION' };
export const stop: StopSimulation = { type: 'STOP_SIMULATION' };