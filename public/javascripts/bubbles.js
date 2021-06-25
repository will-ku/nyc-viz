export const salesVolume = (borough) => {
  d3.csv(
    "https://gist.githubusercontent.com/will-ku/6738acd6b2988fc93d62166da77c7979/raw/3d7f1f8f20059270c5d555d9e54976aceb4555b0/recordSalesVolumeAll"
  ).then((allData) => {
    let data = new Array();
    let boroughArr = new Array();

    for (let i = 0; i < allData.length; i++) {
      // debugger;
      if (allData[i].Borough === `${borough}`) boroughArr.push(allData[i]);
    }

    console.log(boroughArr);
  });
};
