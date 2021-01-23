import type { Container, IDelta, IParticleUpdater, Particle } from "tsparticles-core";
import { AnimationStatus, checkDestroy, clamp } from "tsparticles-core";

export class SizeUpdater implements IParticleUpdater {
    constructor(private readonly container: Container) {}

    public isEnabled(particle: Particle): boolean {
        const sizeOpt = particle.options.size;
        const sizeAnim = sizeOpt.animation;

        return (
            !particle.destroyed &&
            !particle.spawning &&
            sizeAnim.enable &&
            (sizeAnim.count <= 0 || particle.loops.size < sizeAnim.count)
        );
    }

    public update(particle: Particle, delta: IDelta): void {
        const container = this.container;
        const sizeOpt = particle.options.size;
        const sizeAnim = sizeOpt.animation;
        const sizeVelocity = (particle.size.velocity ?? 0) * delta.factor;
        const value = sizeOpt.value;
        const minValue = (typeof value === "number" ? value : value.min) * container.retina.pixelRatio;
        const maxValue = (typeof value === "number" ? value : value.max) * container.retina.pixelRatio;

        if (!this.isEnabled(particle)) {
            return;
        }

        switch (particle.size.status) {
            case AnimationStatus.increasing:
                if (particle.size.value >= maxValue) {
                    particle.size.status = AnimationStatus.decreasing;
                    particle.loops.size++;
                } else {
                    particle.size.value += sizeVelocity;
                }
                break;
            case AnimationStatus.decreasing:
                if (particle.size.value <= minValue) {
                    particle.size.status = AnimationStatus.increasing;
                    particle.loops.size++;
                } else {
                    particle.size.value -= sizeVelocity;
                }
        }

        checkDestroy(particle, sizeAnim.destroy, particle.size.value, minValue, maxValue);

        if (!particle.destroyed) {
            particle.size.value = clamp(particle.size.value, minValue, maxValue);
        }
    }
}
