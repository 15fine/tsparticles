import type { RecursivePartial } from "../../../../Types";
import type { IValueWithRandom } from "../../../Interfaces/IValueWithRandom";
import { ValueWithRandom } from "../../ValueWithRandom";

/**
 * @category Options
 */
export class OrbitRotation extends ValueWithRandom {
    public value: number;

    constructor() {
        super();

        this.value = 45;
        this.random.enable = false;
        this.random.minimumValue = 0;
    }

    public load(data?: RecursivePartial<IValueWithRandom>): void {
        if (data === undefined) {
            return;
        }

        super.load(data);
    }
}
