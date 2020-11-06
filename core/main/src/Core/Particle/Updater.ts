import type { Container } from "../Container";
import type { Particle } from "../Particle";
import { NumberUtils, Utils } from "../../Utils";
import { AnimationStatus, DestroyType, OutMode, OutModeAlt } from "../../Enums";
import type { IDelta } from "../Interfaces/IDelta";
import { OutModeDirection } from "../../Enums/Directions/OutModeDirection";
import { IBounds } from "../Interfaces/IBounds";
import { IDimension } from "../Interfaces/IDimension";
import { ICoordinates } from "../Interfaces/ICoordinates";

interface IBounceData {
    particle: Particle;
    outMode: OutMode | OutModeAlt | keyof typeof OutMode;
    direction: OutModeDirection;
    bounds: IBounds;
    canvasSize: IDimension;
    offset: ICoordinates;
    size: number;
}

function bounceHorizontal(data: IBounceData): void {
    if (
        data.outMode === OutMode.bounce ||
        data.outMode === OutMode.bounceHorizontal ||
        data.outMode === "bounceHorizontal"
    ) {
        const velocity = data.particle.velocity.horizontal;
        let bounced = false;

        if (
            (data.direction === OutModeDirection.right && data.bounds.right >= data.canvasSize.width && velocity > 0) ||
            (data.direction === OutModeDirection.left && data.bounds.left <= 0 && velocity < 0)
        ) {
            const newVelocity = NumberUtils.getValue(data.particle.particlesOptions.bounce.horizontal);

            data.particle.velocity.horizontal *= -newVelocity;

            bounced = true;
        }

        if (bounced) {
            const minPos = data.offset.x + data.size;

            if (data.bounds.right >= data.canvasSize.width) {
                data.particle.position.x = data.canvasSize.width - minPos;
            } else if (data.bounds.left <= 0) {
                data.particle.position.x = minPos;
            }
        }
    }
}

function bounceVertical(data: IBounceData): void {
    if (
        data.outMode === OutMode.bounce ||
        data.outMode === OutMode.bounceVertical ||
        data.outMode === "bounceVertical"
    ) {
        const velocity = data.particle.velocity.vertical;
        let bounced = false;

        if (
            (data.direction === OutModeDirection.bottom &&
                data.bounds.bottom >= data.canvasSize.height &&
                velocity > 0) ||
            (data.direction === OutModeDirection.top && data.bounds.top <= 0 && velocity < 0)
        ) {
            const newVelocity = NumberUtils.getValue(data.particle.particlesOptions.bounce.vertical);

            data.particle.velocity.vertical *= -newVelocity;

            bounced = true;
        }

        if (bounced) {
            const minPos = data.offset.y + data.size;

            if (data.bounds.bottom >= data.canvasSize.height) {
                data.particle.position.y = data.canvasSize.height - minPos;
            } else if (data.bounds.top <= 0) {
                data.particle.position.y = minPos;
            }
        }
    }
}

function checkDestroy(
    particle: Particle,
    destroy: DestroyType | keyof typeof DestroyType,
    value: number,
    minValue: number,
    maxValue: number
): void {
    switch (destroy) {
        case DestroyType.max:
            if (value >= maxValue) {
                particle.destroy();
            }
            break;
        case DestroyType.min:
            if (value <= minValue) {
                particle.destroy();
            }
            break;
    }
}

/**
 * Particle updater, it manages movement
 * @category Core
 */
export class Updater {
    constructor(private readonly container: Container, private readonly particle: Particle) {}

    public update(delta: IDelta): void {
        if (this.particle.destroyed) {
            return;
        }

        this.updateLife(delta);

        if (this.particle.destroyed || this.particle.spawning) {
            return;
        }

        /* change opacity status */
        this.updateOpacity(delta);

        /* change size */
        this.updateSize(delta);

        /* change size */
        this.updateAngle(delta);

        /* change color */
        this.updateColor(delta);

        /* change stroke color */
        this.updateStrokeColor(delta);

        /* out of canvas modes */
        this.updateOutModes(delta);
    }

    private updateLife(delta: IDelta): void {
        const particle = this.particle;
        let justSpawned = false;

        if (particle.spawning) {
            particle.lifeDelayTime += delta.value;

            if (particle.lifeDelayTime >= particle.lifeDelay) {
                justSpawned = true;
                particle.spawning = false;
                particle.lifeDelayTime = 0;
                particle.lifeTime = 0;
            }
        }

        if (particle.lifeDuration === -1) {
            return;
        }

        if (!particle.spawning) {
            if (justSpawned) {
                particle.lifeTime = 0;
            } else {
                particle.lifeTime += delta.value;
            }

            if (particle.lifeTime >= particle.lifeDuration) {
                particle.lifeTime = 0;

                if (particle.livesRemaining > 0) {
                    particle.livesRemaining--;
                }

                if (particle.livesRemaining === 0) {
                    particle.destroy();
                    return;
                }

                const canvasSize = this.container.canvas.size;

                particle.position.x = NumberUtils.randomInRange(0, canvasSize.width);
                particle.position.y = NumberUtils.randomInRange(0, canvasSize.height);

                particle.spawning = true;
                particle.lifeDelayTime = 0;
                particle.lifeTime = 0;

                const lifeOptions = particle.particlesOptions.life;

                particle.lifeDelay = NumberUtils.getValue(lifeOptions.delay) * 1000;
                particle.lifeDuration = NumberUtils.getValue(lifeOptions.duration) * 1000;
            }
        }
    }

    private updateOpacity(delta: IDelta): void {
        const particle = this.particle;
        const opacityAnim = particle.particlesOptions.opacity.anim;
        const minValue = opacityAnim.minimumValue;
        const maxValue = particle.particlesOptions.opacity.value;

        if (opacityAnim.enable) {
            switch (particle.opacity.status) {
                case AnimationStatus.increasing:
                    if (particle.opacity.value >= maxValue) {
                        particle.opacity.status = AnimationStatus.decreasing;
                    } else {
                        particle.opacity.value += (particle.opacity.velocity ?? 0) * delta.factor;
                    }
                    break;
                case AnimationStatus.decreasing:
                    if (particle.opacity.value <= minValue) {
                        particle.opacity.status = AnimationStatus.increasing;
                    } else {
                        particle.opacity.value -= (particle.opacity.velocity ?? 0) * delta.factor;
                    }
                    break;
            }

            checkDestroy(particle, opacityAnim.destroy, particle.opacity.value, minValue, maxValue);

            if (!particle.destroyed) {
                particle.opacity.value = NumberUtils.clamp(particle.opacity.value, minValue, maxValue);
            }
        }
    }

    private updateSize(delta: IDelta): void {
        const container = this.container;
        const particle = this.particle;
        const sizeOpt = particle.particlesOptions.size;
        const sizeAnim = sizeOpt.animation;
        const sizeVelocity = (particle.size.velocity ?? 0) * delta.factor;
        const maxValue = particle.sizeValue ?? container.retina.sizeValue;
        const minValue = sizeAnim.minimumValue * container.retina.pixelRatio;

        if (sizeAnim.enable) {
            switch (particle.size.status) {
                case AnimationStatus.increasing:
                    if (particle.size.value >= maxValue) {
                        particle.size.status = AnimationStatus.decreasing;
                    } else {
                        particle.size.value += sizeVelocity;
                    }
                    break;
                case AnimationStatus.decreasing:
                    if (particle.size.value <= minValue) {
                        particle.size.status = AnimationStatus.increasing;
                    } else {
                        particle.size.value -= sizeVelocity;
                    }
            }

            checkDestroy(particle, sizeAnim.destroy, particle.size.value, minValue, maxValue);

            if (!particle.destroyed) {
                particle.size.value = NumberUtils.clamp(particle.size.value, minValue, maxValue);
            }
        }
    }

    private updateAngle(delta: IDelta): void {
        const particle = this.particle;
        const rotate = particle.particlesOptions.rotate;
        const rotateAnimation = rotate.animation;
        const speed = (particle.rotate.velocity ?? 0) * delta.factor;
        const max = 2 * Math.PI;

        if (rotate.path) {
            particle.pathAngle = Math.atan2(particle.velocity.vertical, particle.velocity.horizontal);
        } else if (rotateAnimation.enable) {
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

    private updateColor(delta: IDelta): void {
        const particle = this.particle;

        if (particle.color.value === undefined) {
            return;
        }

        if (particle.particlesOptions.color.animation.enable) {
            particle.color.value.h += (particle.color.velocity ?? 0) * delta.factor;

            if (particle.color.value.h > 360) {
                particle.color.value.h -= 360;
            }
        }
    }

    private updateStrokeColor(delta: IDelta): void {
        const particle = this.particle;

        const color = particle.stroke.color;

        if (typeof color === "string" || color === undefined) {
            return;
        }

        if (particle.strokeColor.value === undefined) {
            return;
        }

        if (color.animation.enable) {
            particle.strokeColor.value.h +=
                (particle.strokeColor.velocity ?? particle.color.velocity ?? 0) * delta.factor;

            if (particle.strokeColor.value.h > 360) {
                particle.strokeColor.value.h -= 360;
            }
        }
    }

    private updateOutModes(delta: IDelta): void {
        const outModes = this.particle.particlesOptions.move.outModes;

        this.updateOutMode(delta, outModes.bottom ?? outModes.default, OutModeDirection.bottom);
        this.updateOutMode(delta, outModes.left ?? outModes.default, OutModeDirection.left);
        this.updateOutMode(delta, outModes.right ?? outModes.default, OutModeDirection.right);
        this.updateOutMode(delta, outModes.top ?? outModes.default, OutModeDirection.top);
    }

    private updateOutMode(
        delta: IDelta,
        outMode: OutMode | keyof typeof OutMode | OutModeAlt,
        direction: OutModeDirection
    ) {
        const container = this.container;
        const particle = this.particle;

        switch (outMode) {
            case OutMode.bounce:
            case OutMode.bounceVertical:
            case OutMode.bounceHorizontal:
            case "bounceVertical":
            case "bounceHorizontal":
                this.updateBounce(delta, direction, outMode);

                break;
            case OutMode.destroy:
                if (!Utils.isPointInside(particle.position, container.canvas.size, particle.getRadius(), direction)) {
                    container.particles.remove(particle);
                }
                break;
            case OutMode.out:
                if (!Utils.isPointInside(particle.position, container.canvas.size, particle.getRadius(), direction)) {
                    this.fixOutOfCanvasPosition(direction);
                }
                break;
            case OutMode.none:
                this.bounceNone(direction);
                break;
        }
    }

    private fixOutOfCanvasPosition(direction: OutModeDirection): void {
        const container = this.container;
        const particle = this.particle;
        const wrap = particle.particlesOptions.move.warp;
        const canvasSize = container.canvas.size;
        const newPos = {
            bottom: canvasSize.height + particle.getRadius() - particle.offset.y,
            left: -particle.getRadius() - particle.offset.x,
            right: canvasSize.width + particle.getRadius() + particle.offset.x,
            top: -particle.getRadius() - particle.offset.y,
        };

        const sizeValue = particle.getRadius();
        const nextBounds = Utils.calculateBounds(particle.position, sizeValue);

        if (direction === OutModeDirection.right && nextBounds.left > canvasSize.width - particle.offset.x) {
            particle.position.x = newPos.left;

            if (!wrap) {
                particle.position.y = Math.random() * canvasSize.height;
            }
        } else if (direction === OutModeDirection.left && nextBounds.right < -particle.offset.x) {
            particle.position.x = newPos.right;

            if (!wrap) {
                particle.position.y = Math.random() * canvasSize.height;
            }
        }

        if (direction === OutModeDirection.bottom && nextBounds.top > canvasSize.height - particle.offset.y) {
            if (!wrap) {
                particle.position.x = Math.random() * canvasSize.width;
            }

            particle.position.y = newPos.top;
        } else if (direction === OutModeDirection.top && nextBounds.bottom < -particle.offset.y) {
            if (!wrap) {
                particle.position.x = Math.random() * canvasSize.width;
            }

            particle.position.y = newPos.bottom;
        }
    }

    private updateBounce(
        delta: IDelta,
        direction: OutModeDirection,
        outMode: OutMode | OutModeAlt | keyof typeof OutMode
    ): void {
        const container = this.container;
        const particle = this.particle;
        let handled = false;

        for (const [, plugin] of container.plugins) {
            if (plugin.particleBounce !== undefined) {
                handled = plugin.particleBounce(particle, delta, direction);
            }

            if (handled) {
                break;
            }
        }

        if (handled) {
            return;
        }

        const pos = particle.getPosition(),
            offset = particle.offset,
            size = particle.getRadius(),
            bounds = Utils.calculateBounds(pos, size),
            canvasSize = container.canvas.size;

        bounceHorizontal({ particle, outMode, direction, bounds, canvasSize, offset, size });
        bounceVertical({ particle, outMode, direction, bounds, canvasSize, offset, size });
    }

    private bounceNone(direction: OutModeDirection): void {
        const particle = this.particle;

        if (particle.particlesOptions.move.distance) {
            return;
        }

        const gravityOptions = particle.particlesOptions.move.gravity;
        const container = this.container;

        if (!gravityOptions.enable) {
            if (!Utils.isPointInside(particle.position, container.canvas.size, particle.getRadius(), direction)) {
                container.particles.remove(particle);
            }
        } else {
            const position = particle.position;

            if (
                (gravityOptions.acceleration >= 0 &&
                    position.y > container.canvas.size.height &&
                    direction === OutModeDirection.bottom) ||
                (gravityOptions.acceleration < 0 && position.y < 0 && direction === OutModeDirection.top)
            ) {
                container.particles.remove(particle);
            }
        }
    }
}
