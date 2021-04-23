import { screen, render, cleanup } from "@testing-library/react";
import ListView from "./ListView";

let sampleData = [{ checked: false }];
afterEach(cleanup);
describe("<ListView />", () => {
  test("render component", () => {
    render(<ListView data={sampleData} />);
    const cbEl = screen.getByTestId("toggle");
    expect(cbEl).toBeInTheDocument();
    expect(cbEl).not.toBeChecked();
  });
});
