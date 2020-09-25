import type { IShapeDrawer } from "../Core/Interfaces/IShapeDrawer";
import type { IParticle } from "../Core/Interfaces/IParticle";

/**
 * @category Shape Drawers
 */
export class LineDrawer implements IShapeDrawer {
    public getSidesCount(): number {
        return 1;
    }

    public draw(context: CanvasRenderingContext2D, particle: IParticle, radius: number): void {
        context.moveTo(0, -radius / 2);
        context.lineTo(0, radius / 2);
    }
}
