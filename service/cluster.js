const { PCA } = require("ml-pca");
const { kmeans } = require("ml-kmeans");
const Corporate = require("../models/Corporate");
const { cache, getCorporateData } = require("./clusterCache");

const getClusterResult = async (stockList, sliderValue) => {
  const ids = [];
  const features = [];
  stockList.forEach((stock) => {
    const { id, name, profitability, stability, activity, potential, ogoong_rate } = stock;
    features.push([profitability, stability, activity, potential, ogoong_rate]);
    ids.push([id, name]);
  });

  // match scale with min-max normalization
  const scaledFeatures = matchScale(features);

  // analyze
  const pcaResult = transfromDimension(scaledFeatures);

  // console.log(sliderValue);
  // map demension and match id with pca result
  const pcaResultAndId = matchIdWithPcaResult(pcaResult, ids, features, sliderValue);

  // kmeans clustering
  const kmeansResult = kmeansClustering(pcaResult);

  // cluster to response
  const clusterResult = await getClusterResultResponse(
    pcaResultAndId,
    kmeansResult
  );

  const averageData = await getAverageData(clusterResult);

  const responseData = {
    clusterResult,
    averageData,
  };

  return responseData;
};

function matchScale(features) {
  return features.map((feature) => {
    const mean = feature.reduce((acc, val) => acc + val, 0) / feature.length;
    const std = Math.sqrt(
      feature.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      feature.length
    );
    return feature.map((val) => (val - mean) / std);
  });
}

function transfromDimension(features) {
  const pca = new PCA(features);
  return pca.predict(features).to2DArray();
}

function matchIdWithPcaResult(pca, ids, features, sliderValue) {
  const result = getMinMaxScale(pca);
  return result.map((point, index) => [
    ids[index][0],
    ids[index][1],
    point[0],
    point[1]
  ]);
}

function kmeansClustering(result) {
  return kmeans(result, 4);
}


async function getClusterResultResponse(result, kmeans) {
  const clusterResult = Array.from({ length: 4 }, (_, id) => ({
    id,
    data: [],
  }));
  kmeans.clusters.map(async (cluster, index) => {
    clusterResult[cluster].data.push({
      id: result[index][0],
      name: result[index][1],
      x: result[index][2],
      y: result[index][3],
    });
  });

  return clusterResult;
  // const corporateData = await getCorporateData();
  // // 클러스터에 대한 id 매핑
  // await Promise.all(kmeans.clusters.map(async (cluster, index) => {
  //   const corp = corporateData[result[index][0]];

  //   clusterResult[cluster].data.push({
  //     id: result[index][0],
  //     name: result[index][1],
  //     x: result[index][2],
  //     y: result[index][3],
  //     수익성: (corp.profitability).toFixed(1),   // profitability
  //     안정성: (corp.stability).toFixed(1),       // stability
  //     활동성: (corp.efficiency).toFixed(1),      // activity
  //     생산성: (corp.growth).toFixed(1),          // potential
  //     오공지수: (corp.ogong_rate).toFixed(1),    // ogoong_rate
  //   });
  // }));
}

// min-max normailzation
function getMinMaxScale(features) {
  const allValues = features.flat();
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  return features.map((feature) => {
    return feature.map((val) => ((val - min) / (max - min)) * 100);
  });
}

async function getAverageData(clusterResult) {
  const averageData = Array.from({ length: 4 }, (_, id) => ({
    id,
    data: [], // 그룹별 profitability, stability, activity, potential, ogoong_rate 평균
  }));

  const corporateData = await getCorporateData();
  await Promise.all(clusterResult.map(async (cluster) => {
    const rates = cluster.data.reduce(
      (acc, corp) => {
        const corpData = corporateData[corp.id];
        acc[0] += corpData.profitability;
        acc[1] += corpData.stability;
        acc[2] += corpData.efficiency;
        acc[3] += corpData.growth;
        acc[4] += 23; // corpData.mention;
        acc[5] += corpData.ogong_rate;
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    );
    averageData[cluster.id].data = rates.map((rate) => (rate / cluster.data.length).toFixed(1));
  }));
  return averageData;
}

module.exports = {
  getClusterResult,
};
