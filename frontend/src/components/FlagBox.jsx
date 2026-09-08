function FlagBox({
  countryCode,
  country = "country name",
  position = "right",
  children,
}) {
  if (!countryCode) return null;
  return (
    <span className={position === "right" ? "flagBox" : "flagBox2"}>
      <img
        src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
        alt={country}
      />

      {children}
    </span>
  );
}

export default FlagBox;
//https://flagcdn.com/w40/pt.png
