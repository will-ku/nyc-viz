export const boroughs = [
  "NYC",
  "Brooklyn",
  "Manhattan",
  "Queens",
  "Bronx",
  "Staten Island",
];

export const nycMap =
  "https://gist.githubusercontent.com/will-ku/785bea3f2d9faaf7aa90c5c101062426/raw/6904b8580c10c7f69037cf4d6090e6929f1de785/nyc.json";

export const salesVolumeCSV =
  "https://gist.githubusercontent.com/will-ku/28386b4e09f4f9a278cb98e041bf1143/raw/8b083f2b1c0c27949ea5fa9fb7037582f2cb974a/recordedSalesVolume_All.csv";

export const medianSalesPriceCSV = "https://gist.githubusercontent.com/will-ku/209695c4336d289906b4aeba31c00220/raw/c568992085b6d4087977c571413d5a4505d56265/medianSalesPrice_All.csv"

export const mappableNeighborhood = (name) => {
  switch (name) {
    case "Midtown East":
      return "Midtown";
    case "Midtown South":
      return "Midtown";
    case "Midtown West":
      return "Hell's Kitchen";
    case "South Jamaica":
      return "Jamaica";
    default:
      return name;
  }
};
