/* eslint-disable no-promise-executor-return */
import { expectType } from "../../../test/test-helpers/expect-type";
import { livingRoomLights } from "../smart-home-setup";

describe("smart home setup - toggles all lights", () => {
  it("toggles all lights", async () => {
    const beforeState = livingRoomLights.all().isOn;
    expect(beforeState).toStrictEqual({
      ceilingLampOne: false,
      ceilingLampTwo: false,
      lampCouch: false,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
      lampCouch: boolean;
    }>(beforeState);
    const response = await livingRoomLights.all().toggle().promise();
    expect(response).toStrictEqual({
      ceilingLampOne: true,
      ceilingLampTwo: true,
      lampCouch: true,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
      lampCouch: boolean;
    }>(response);
    const afterState = livingRoomLights.all().isOn;
    expect(afterState).toStrictEqual({
      ceilingLampOne: true,
      ceilingLampTwo: true,
      lampCouch: true,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
      lampCouch: boolean;
    }>(afterState);
  });
  it("toggles some lights", async () => {
    const beforeState = livingRoomLights.for(
      "ceilingLampOne",
      "ceilingLampTwo"
    ).isOn;
    expect(beforeState).toStrictEqual({
      ceilingLampOne: true,
      ceilingLampTwo: true,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
    }>(beforeState);
    const response = await livingRoomLights
      .for("ceilingLampOne", "ceilingLampTwo")
      .toggle()
      .promise();
    expect(response).toStrictEqual({
      ceilingLampOne: false,
      ceilingLampTwo: false,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
    }>(response);
    const afterState = livingRoomLights.all().isOn;
    expect(afterState).toStrictEqual({
      ceilingLampOne: false,
      ceilingLampTwo: false,
      lampCouch: true,
    });
    expectType<{
      ceilingLampOne: boolean;
      ceilingLampTwo: boolean;
      lampCouch: boolean;
    }>(afterState);
  });
  it("sets brightness and toggles while chained", async () => {
    expect(livingRoomLights.all().getBrightness).toStrictEqual({
      ceilingLampOne: 50,
      ceilingLampTwo: 50,
      lampCouch: 50,
    });
    expect(livingRoomLights.all().isOn).toStrictEqual({
      ceilingLampOne: false,
      ceilingLampTwo: false,
      lampCouch: true,
    });
    const promiseResponse = await livingRoomLights
      .all()
      .chain()
      .setBrightness(30)
      .toggle()
      .promise();
    expectType<{
      ceilingLampOne: [number, boolean];
      ceilingLampTwo: [number, boolean];
      lampCouch: [number, boolean];
    }>(promiseResponse);
    expect(promiseResponse).toStrictEqual({
      ceilingLampOne: [30, true],
      ceilingLampTwo: [30, true],
      lampCouch: [30, false],
    });
    expect(livingRoomLights.all().getBrightness).toStrictEqual({
      ceilingLampOne: 30,
      ceilingLampTwo: 30,
      lampCouch: 30,
    });
    expect(livingRoomLights.all().isOn).toStrictEqual({
      ceilingLampOne: true,
      ceilingLampTwo: true,
      lampCouch: false,
    });
  });
  it("returns chained data as unresolved promises", async () => {
    const promiseData = livingRoomLights
      .all()
      .chain()
      .setBrightness(30)
      .toggle().data;
    expectType<{
      ceilingLampOne: [Promise<number>, Promise<boolean>];
      ceilingLampTwo: [Promise<number>, Promise<boolean>];
      lampCouch: [Promise<number>, Promise<boolean>];
    }>(promiseData);
    expect(promiseData).toStrictEqual({
      ceilingLampOne: [new Promise(() => 30), new Promise(() => false)],
      ceilingLampTwo: [new Promise(() => 30), new Promise(() => false)],
      lampCouch: [new Promise(() => 30), new Promise(() => false)],
    });
    expect(await promiseData.ceilingLampOne[0]).toStrictEqual(30);
    expect(await promiseData.ceilingLampOne[1]).toStrictEqual(false);
  });
});
