export const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--background-color)",
    border: "1px solid var(--line-color)",
    borderRadius: "0.3rem",
    width: "5rem",
    minHeight: "1rem",
    color: "var(--text-color)",
    marginTop: "0.2rem",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0.33rem 0.5rem",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0.33rem",
  }),
  option: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    background: "var(--background-color)",
    color: "var(--text-color)",
    fontSize: "0.7em",
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
    fontSize: "0.8em",
    fontWeight: "700",
  }),
};
