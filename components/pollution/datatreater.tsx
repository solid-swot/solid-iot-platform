import { useDataset } from "@inrupt/solid-ui-react";
import { getDecimal, getThingAll, SolidDataset } from "@inrupt/solid-client";
import React from "react";
import { getSolidDataset } from "@inrupt/solid-client/umd";

export default function sensorList() {
  const pollutionURI = "https://solid.luxumbra.fr/iot/sensors.ttl";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const { dataset, error } = useDataset(pollutionURI);
  let dataset: SolidDataset;
  return getSolidDataset(pollutionURI).then(function (response) {
    console.log("Response est  : ", response);
    dataset = response;
    const things = getThingAll(dataset);
    const sensors = [];
    // eslint-disable-next-line func-names
    things.forEach(function (thing) {
      const latitude = getDecimal(thing, "http://schema.org/latitude");
      const longitude = getDecimal(thing, "http://schema.org/longitude");
      sensors.push({ latitude, longitude });
      // console.log(`Sensor position : x = ${longitude} y = ${latitude}`);
      console.log("sensors est : ", sensors);
    });
    return sensors;
  });
}

export function FetchData(sensorName) {
  const sensorURI = `https://solid.luxumbra.fr/iot/observations/${sensorName}.ttl`;
  const { dataset, error } = useDataset(sensorURI);
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
  return "data";
}
