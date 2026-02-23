module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ["js"],
  setupFilesAfterEnv: ["./jest.setup.js"]
};
