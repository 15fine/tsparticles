import type { Container, IDelta, IParticleUpdater, Particle } from "tsparticles-core";
import { AnimationStatus } from "tsparticles-core";

export class AngleUpdater implements IParticleUpdater {
    constructor(private readonly container: Container) {}

    public isEnabled(particle: Particle): boolean {
        const rotate = particle.options.rotate;
        const rotateAnimation = rotate.animation;

        return !particle.destroyed && !particle.spawning && !rotate.path && rotateAnimation.enable;
    }

    public update(particle: Particle, delta: IDelta): void {
        if (!this.isEnabled(particle)) {
            return;
        }

        const speed = (particle.rotate.velocity ?? 0) * delta.factor;
        const max = 2 * Math.PI;

        switch (particle.rotate.status) {
            case AnimationStatus.increasing:
                particle.rotate.value += speed;

                if (particle.rotate.value > max) {
                    particle.rotate.value -= max;
                }
                break;
            case AnimationStatus.decreasing:
            default:
                particle.rotate.value -= speed;

                if (particle.rotate.value < 0) {
                    particle.rotate.value += max;
                }
                break;
        }
    }
}
