export function createRiskRenderer(weatherRisk) {
  return {
    type: "class-breaks",
    valueExpression: `
      var code = Number($feature.AREA_S_CD);
      var weatherRisk = ${weatherRisk};
      var vulnerabilityRisk = 40 + ((code * 13) % 50);
      var shelterAccessRisk = 30 + ((code * 7) % 60);
      return Round(weatherRisk * 0.5 + vulnerabilityRisk * 0.3 + shelterAccessRisk * 0.2);
    `,
    classBreakInfos: [
      {
        minValue: 80,
        maxValue: 100,
        symbol: {
          type: "simple-fill",
          color: [239, 68, 68, 0.65],
          outline: { color: [255, 255, 255, 0.45], width: 0.7 },
        },
        label: "Critical",
      },
      {
        minValue: 60,
        maxValue: 79,
        symbol: {
          type: "simple-fill",
          color: [249, 115, 22, 0.6],
          outline: { color: [255, 255, 255, 0.4], width: 0.7 },
        },
        label: "High",
      },
      {
        minValue: 40,
        maxValue: 59,
        symbol: {
          type: "simple-fill",
          color: [234, 179, 8, 0.55],
          outline: { color: [255, 255, 255, 0.35], width: 0.7 },
        },
        label: "Moderate",
      },
      {
        minValue: 0,
        maxValue: 39,
        symbol: {
          type: "simple-fill",
          color: [34, 197, 94, 0.45],
          outline: { color: [255, 255, 255, 0.3], width: 0.7 },
        },
        label: "Lower",
      },
    ],
  };
}
