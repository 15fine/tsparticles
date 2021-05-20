import type { Particle } from "../Particle";
import type { Vector } from "../Particle/Vector";

/**
 * @category Interfaces
 */
export interface IMovePathGenerator {
    init: () => void;

    update: () => void;

    generate: (particle: Particle) => Vector;
}