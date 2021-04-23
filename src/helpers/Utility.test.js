import { isCheckedAnyOfItem } from "./Utility";

let sampleData = [{ checked: false }, { checked: true }];

test("isCheckedAnyOfItem", () => {
  expect(isCheckedAnyOfItem(sampleData)).toBe(true);
});
