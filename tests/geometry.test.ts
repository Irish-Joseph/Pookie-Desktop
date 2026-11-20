import { describe, expect, it } from 'vitest';
import { clampWindow } from '../src/services/geometry';

describe('window recovery', () => {
  const areas = [{x:0,y:0,width:1920,height:1040}];
  it('recovers a saved location when its monitor has been disconnected', () => {
    expect(clampWindow({x:3000,y:200}, {width:530,height:590}, areas)).toEqual({x:1390,y:200});
  });
  it('keeps the panel within a smaller work area', () => {
    expect(clampWindow({x:900,y:700}, {width:530,height:590}, [{x:0,y:0,width:1280,height:720}])).toEqual({x:750,y:130});
  });
  it('handles a monitor to the left of the primary monitor', () => {
    expect(clampWindow({x:-1600,y:80}, {width:180,height:180}, [...areas,{x:-1920,y:0,width:1920,height:1080}])).toEqual({x:-1600,y:80});
  });
});
