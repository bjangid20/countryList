import { fireEvent, render, screen } from "@testing-library/react";
import SearchBox from "./SearchBox";

it("searchRenderCheck", () => {
  const { queryByTitle } = render(<SearchBox />);
  const input = queryByTitle("FilterLocations");
  expect(input).toBeTruthy();
});

describe("changeInInput", () => {
  it("onChange", () => {
    const { queryByTitle } = render(<SearchBox />);
    const input = queryByTitle("FilterLocations");
    fireEvent.change(input, { target: { value: "testValue" } });
    expect(input.value).toBe("testValue");
  });
});
