const ALLOWED_TYPES = ["LIBRARY", "COMM_CNTR", "CVC_CNTR", "MALL"];

export async function loadCoolingPlaces() {
  const response = await fetch("/air-conditioned-cool-spaces.geojson");
  const data = await response.json();

  return data.features
    .map((feature, index) => {
      const props = feature.properties;
      if (!ALLOWED_TYPES.includes(props.locationCode)) return null;

      const coords = feature.geometry?.coordinates?.[0];
      if (!coords) return null;

      const [lng, lat] = coords;
      const capacity = 35 + ((Number(props._id) * 17) % 61);

      return {
        id: props._id,
        index,
        name: props.locationName,
        type: props.locationDesc,
        code: props.locationCode,
        address: props.address,
        phone: props.phone,
        hours: `${props.monOpen} - ${props.monClose}`,
        amenities: props.amenities,
        capacity,
        backupPower:
          Number(props._id) % 3 === 0
            ? true
            : Number(props._id) % 3 === 1
              ? false
              : null,
        lng,
        lat,
      };
    })
    .filter(Boolean);
}
