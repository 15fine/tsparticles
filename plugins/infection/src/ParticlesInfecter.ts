import type { IDelta } from "tsparticles-core";
import { ParticlesInteractorBase } from "tsparticles-core";
import type { InfectableContainer, InfectableParticle } from "./Types";
import type { IInfectionOptions } from "./Options/Interfaces/IInfectionOptions";

/**
 * @category Interactions
 */
export class ParticlesInfecter extends ParticlesInteractorBase {
    constructor(container: InfectableContainer) {
        super(container, "infection");
    }

    public isEnabled(): boolean {
        const infOptions = (this.container.options as unknown) as IInfectionOptions;

        return infOptions?.infection?.enable ?? false;
    }

    public reset(): void {
        // do nothing
    }

    public interact(p1: InfectableParticle, delta: IDelta): void {
        const infecter = (this.container as InfectableContainer).infecter;

        if (!infecter) {
            return;
        }

        infecter.updateInfection(p1, delta.value);

        if (p1.infection.stage === undefined) {
            return;
        }

        const container = this.container;
        const options = (container.options as unknown) as IInfectionOptions;
        const infectionOptions = options.infection;

        if (!infectionOptions.enable || infectionOptions.stages.length < 1) {
            return;
        }

        const infectionStage1 = infectionOptions.stages[p1.infection.stage];
        const pxRatio = container.retina.pixelRatio;
        const radius = p1.getRadius() * 2 + infectionStage1.radius * pxRatio;
        const pos = p1.getPosition();
        const infectedStage1 = infectionStage1.infectedStage ?? p1.infection.stage;
        const query = container.particles.quadTree.queryCircle(pos, radius);
        const infections = infectionStage1.rate;
        const neighbors = query.length;

        for (const p2 of query) {
            const infP2 = p2 as InfectableParticle;

            if (
                infP2 === p1 ||
                infP2.destroyed ||
                infP2.spawning ||
                !(infP2.infection.stage === undefined || infP2.infection.stage !== p1.infection.stage)
            ) {
                continue;
            }

            if (Math.random() < infections / neighbors) {
                if (infP2.infection.stage === undefined) {
                    infecter.startInfection(infP2, infectedStage1);
                } else if (infP2.infection.stage < p1.infection.stage) {
                    infecter.updateInfectionStage(infP2, infectedStage1);
                } else if (infP2.infection.stage > p1.infection.stage) {
                    const infectionStage2 = infectionOptions.stages[infP2.infection.stage];
                    const infectedStage2 = infectionStage2?.infectedStage ?? infP2.infection.stage;

                    infecter.updateInfectionStage(p1, infectedStage2);
                }
            }
        }
    }
}
