import { useDataset } from "@inrupt/solid-ui-react";
import { getDecimal, getThingAll } from "@inrupt/solid-client";
import React from "react";

export default function sensorList() {
  const pollutionURI = "https://solid.luxumbra.fr/iot/sensors.ttl";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { dataset, error } = useDataset(pollutionURI);
  // eslint-disable-next-line no-void
  // void getSolidDataset(pollutionURI).then((response) => dataset);
  // const { ds, serverRessourceInfo} = getSolidDataset(pollutionURI);
  console.log(dataset);
  const things = getThingAll(dataset);
  const sensors = [];
  // eslint-disable-next-line func-names
  things.forEach(function (thing) {
    const latitude = getDecimal(thing, "http://schema.org/latitude");
    const longitude = getDecimal(thing, "http://schema.org/longitude");
    sensors.push({ latitude, longitude });
    // console.log(`Sensor position : x = ${longitude} y = ${latitude}`);
  });
  if (error) return <div>failed to load</div>;
  if (!dataset) return <div>loading...</div>;
  return sensors;
}
