module.exports = {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => message.includes("Engineering foundation validation") || message === "test"],
};
