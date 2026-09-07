/**
 * Early-records tool helper tests — the pure markup rendering and the unit
 * scoping rule, no network. Search ranking and filtering belong to the records
 * API and are tested there.
 *
 * Written as .mjs (not .ts): the worker tsconfig pins types that make a .ts test
 * fail to resolve `bun:test`.
 */
import { test, expect } from "bun:test";
import { renderNodes, unitNeedsSource } from "../src/tools/records.ts";


test("renderNodes writes 割書 columns inside one line", () => {
  expect(
    renderNodes([
      { t: "text", s: "天　リキタ" },
      { t: "warigaki", lines: [[{ t: "text", s: "升る　リキン" }], [{ t: "text", s: "高い　リイ" }]] },
    ]),
  ).toBe("天　リキタ⟨升る　リキン｜高い　リイ⟩");
});

test("renderNodes marks alternatives, gaps, editorial supplements and sic", () => {
  expect(
    renderNodes([
      { t: "text", s: "月　クンネチユツプ" },
      { t: "alt" },
      { t: "text", s: "アンチカラチユツ" },
      { t: "gap", reason: "blank" },
      { t: "editorial", s: "フ" },
      { t: "sic" },
    ]),
  ).toBe("月　クンネチユツプ／アンチカラチユツ［欠：空白］〔フ〕〔ママ〕");
});

test("renderNodes keeps ruby, corrections, notes, comments and quotations", () => {
  expect(
    renderNodes([
      { t: "ruby", rb: "蝦夷", rt: "えぞ" },
      { t: "subst", del: "ヘ", add: "ベ" },
      { t: "noteref", n: "3" },
      { t: "comment", s: "朱書" },
      { t: "quote", nodes: [{ t: "text", s: "ワツカ" }] },
      { t: "hi", s: "水" },
    ]),
  ).toBe("蝦夷（えぞ）⟦ヘ→ベ⟧［注 3］［※ 朱書］「ワツカ」水");
});

test("unitNeedsSource holds a unit slug to its source, since works share them", () => {
  expect(unitNeedsSource({ unit: "ryukoku" })).toBe(true);
  expect(unitNeedsSource({ source: "ezo-soshi", unit: "ryukoku" })).toBe(false);
  expect(unitNeedsSource({ source: "moshiogusa" })).toBe(false);
  expect(unitNeedsSource({})).toBe(false);
});
