export const salesData = async () => {
  const allData = await d3.csv(
    "https://gist.githubusercontent.com/will-ku/87dc16f167af2d117ada33035c425d17/raw/08c396370ad39588f38fd6c79f6b1252d4def2e6/medianSalesPrice_All.csv"
  );
};
