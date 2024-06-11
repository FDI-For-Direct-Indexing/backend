const { PCA } = require("ml-pca");
const { kmeans } = require("ml-kmeans");

const getClusterResult = async (stockList) => {
  const ids = [];
  const features = [];
  stockList.forEach((stock) => {
    const { id, profitability, stability, activity, potential, ogoong_rate } =
      stock;
    features.push([profitability, stability, activity, potential, ogoong_rate]);
    ids.push(id);
  });

  // match scale with min-max normalization
  const scaledFeatures = await matchScale(features);

  // analyze
  const pcaResult = await transfromDemension(scaledFeatures);

  // map demension and match id with pca result
  const pcaResultAndId = await matchIdWithPcaResult(pcaResult, ids);

  // kmeans clustering
  const kmeansResult = await kmeansClustering(pcaResult);

  // cluster to response
  const clusterResult = await getClusterResultResponse(
    pcaResultAndId,
    kmeansResult
  );

  return clusterResult;
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

function transfromDemension(features) {
  const pca = new PCA(features);
  return pca.predict(features).to2DArray();
}

function matchIdWithPcaResult(pca, ids) {
  const result = getMinMaxScale(pca);
  return result.map((point, index) => [ids[index], point[0], point[1]]);
}

function kmeansClustering(result) {
  return kmeans(result, 5);
}

function getClusterResultResponse(result, kmeans) {
  const clusterResult = Array.from({ length: 5 }, (_, id) => ({
    id,
    data: [],
  }));

  // 클러스터에 대한 id 매핑
  kmeans.clusters.map((cluster, index) => {
    clusterResult[cluster].data.push({
      id: result[index][0],
      x: result[index][1],
      y: result[index][2],
    });
  });
  return clusterResult;
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

module.exports = {
  getClusterResult,
};
