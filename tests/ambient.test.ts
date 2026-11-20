import { describe, expect, it } from "vitest";
import { ambientState } from "../src/animations/states";

describe("ambient character state", () => {
  it("blinks only while idle", () => {
    expect(ambientState("idle", 5000, true)).toBe("blink");
    expect(ambientState("thinking", 5000, true)).toBe("thinking");
  });
  it("sleeps after inactivity and keeps urgent states visible", () => {
    expect(ambientState("idle", 120000, false)).toBe("sleepy");
    expect(ambientState("capture", 120000, false)).toBe("capture");
  });
});
