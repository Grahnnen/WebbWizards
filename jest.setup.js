import jestAxe from "jest-axe";
expect.extend(jestAxe.toHaveNoViolations);

global.fetch = global.fetch || jest.fn(() =>
  Promise.resolve({ ok: true, json: async () => [] })
);
