export const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--background-color)",
    border: "1px solid var(--line-color)",
    borderRadius: "0.3rem",
    minHeight: "1rem",
    width: "5rem",
    color: "var(--text-color)",
    cursor: "pointer",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0.3rem 0.5rem",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0.3rem",
  }),
  option: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    background: "var(--background-color)",
    color: "var(--text-color)",
    fontSize: "0.6em",
    ":hover": {
      background: "var(--main-color)",
      color: "#ffffff",
    },
  }),
  singleValue: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    color: "var(--text-color)",
    fontSize: "0.7em",
    fontWeight: "700",
  }),
};
