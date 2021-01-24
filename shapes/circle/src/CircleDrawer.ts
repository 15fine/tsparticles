import type { IParticle, IShapeDrawer } from "tsparticles-core";

/**
 * @category Shape Drawers
 */
export class CircleDrawer implements IShapeDrawer {
    public getSidesCount(): number {
        return 12;
    }

    public draw(context: CanvasRenderingContext2D, particle: IParticle, radius: number): void {
        context.arc(0, 0, radius, 0, Math.PI * 2, false);
    }
}
