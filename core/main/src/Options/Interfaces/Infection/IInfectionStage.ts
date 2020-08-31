import type { IColor } from "../../../Core/Interfaces/IColor";

/**
 * Infection stage options
 */
export interface IInfectionStage {
    /**
     * Infection stage particle color
     */
    color: string | IColor;

    /**
     * Infection stage contagious area radius, if 0 only particles touching would be affected
     */
    radius: number;

    /**
     * Infection rate, the higher it is, the more particles will be infected.
     */
    rate: number;

    /**
     * Infection stage duration, after this time has passed it will go to the next stage,
     * resets to first or turn back to normal if cure is enabled.
     */
    duration?: number;

    /**
     * The infected stage set to the infected particles by the current stage
     */
    infectedStage?: number;
}
