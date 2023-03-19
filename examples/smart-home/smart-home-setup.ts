import { StructuredResources } from "../../services/structured-resources";

const delayedResponse = <T extends unknown>(
  duration: number,
  response: T
): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, duration);
  });

export class LightBulb {
  private on: boolean;

  private brightness: number;

  constructor(public readonly name: string) {
    this.on = false;
    this.brightness = 50;
  }

  get isOn() {
    return this.on;
  }

  get getBrightness() {
    return this.brightness;
  }

  async toggle(): Promise<boolean> {
    this.on = !this.on;
    return delayedResponse(3000, this.on);
  }

  async setBrightness(brightness: number): Promise<number> {
    this.brightness = brightness;
    return delayedResponse(3000, this.brightness);
  }
}

export const livingRoomLights = new StructuredResources({
  lampCouch: new LightBulb("lamp-couch"),
  ceilingLampOne: new LightBulb("ceiling-lamp-a"),
  ceilingLampTwo: new LightBulb("ceiling-lamp-b"),
});
