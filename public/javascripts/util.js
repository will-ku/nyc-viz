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

export const salesVolume =
  "https://gist.githubusercontent.com/will-ku/6738acd6b2988fc93d62166da77c7979/raw/3d7f1f8f20059270c5d555d9e54976aceb4555b0/recordSalesVolumeAll";

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
