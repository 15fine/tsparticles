import type {
    ShapeDrawerAfterEffectFunction,
    ShapeDrawerDestroyFunction,
    ShapeDrawerDrawFunction,
    ShapeDrawerInitFunction,
    ShapeDrawerSidesCountFunction,
} from "../../Types";

/**
 * @category Interfaces
 */
export interface IShapeDrawer {
    getSidesCount?: ShapeDrawerSidesCountFunction;
    init?: ShapeDrawerInitFunction;
    draw: ShapeDrawerDrawFunction;
    afterEffect?: ShapeDrawerAfterEffectFunction;
    destroy?: ShapeDrawerDestroyFunction;
}
