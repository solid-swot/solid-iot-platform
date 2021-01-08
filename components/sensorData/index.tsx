/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {
  getDecimal,
  getInteger,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getThingAll,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import {
  Inject,
  LayerDirective,
  LayersDirective,
  MapsComponent,
  MapsTooltip,
  Marker,
  MarkerDirective,
  MarkersDirective,
  NavigationLineDirective,
  NavigationLinesDirective,
} from "@syncfusion/ej2-react-maps";
import SensorMap from "../sensorMap";

// TODO
async function LastValue(name: string): Promise<number> {
  const sensorDataUri = `https://solid.luxumbra.fr/iot/observations/${name}.ttl`;
  // console.log(`Le nom du thing sensor est : ${name}`);
  let dataset: SolidDataset;
  try {
    dataset = await getSolidDataset(sensorDataUri);
  } catch (e) {
    console.log(`LAST VALUE  : erreur de getSolidDataset : ${e}`);
  }
  const observations = getThingAll(dataset);
  const obs1 = observations[0];
  const value: number = getInteger(
    obs1,
    "http://www.w3.org/ns/sosa/hasSimpleResult"
  );
  console.log(`LAST VALUE  : L'observation vaut : ${value}`);
  return value;
}

export default function SensorDataMap(): React.ReactElement {
  const pollutionURI = "https://solid.luxumbra.fr/iot/sensors.ttl";
  const [sensorList, setSensorList] = useState([]);
  useEffect(() => {
    // Create an scoped async function in the hook
    async function hookFunction() {
      let dataset: SolidDataset;
      try {
        dataset = await getSolidDataset(pollutionURI);
      } catch (e) {
        console.log(`erreur de getSolidDataset : ${e}`);
      }
      const things = getThingAll(dataset);
      let val: number;
      for (const thing of things) {
        const lat: number = getDecimal(thing, "http://schema.org/latitude");
        const long: number = getDecimal(thing, "http://schema.org/longitude");
        const name: string = getStringNoLocale(
          thing,
          "http://xmlns.com/foaf/0.1/name"
        );
        console.log(`Name : ${name}`);
        try {
          // eslint-disable-next-line no-await-in-loop
          val = await LastValue(name);
        } catch (e) {
          console.log(e);
          val = -1;
        }
        const i = sensorList.findIndex(function (element, index, array) {
          return element.latitude === lat && element.longitude === long;
        });
        if (i === -1) {
          const a = sensorList.push({
            latitude: lat,
            longitude: long,
            value: val,
          }); // value: val,
        } else {
          sensorList[i] = {
            latitude: lat,
            longitude: long,
            value: val,
          };
        }
        console.log("sensors est : ", sensorList);
        setSensorList(sensorList);
      }
    }
    const a = hookFunction();
  }, [sensorList]);

  return <SensorMap sensors={sensorList} />;
  /* console.log("Map sensors are : ", sensorList);
  return (
    <Container>
      <MapsComponent
        id="maps"
        zoomSettings={{ zoomFactor: 15 }}
        centerPosition={{ latitude: 43.57079, longitude: 1.46625 }}
      >
        <Inject services={[Marker, MapsTooltip]} />
        <LayersDirective>
          <LayerDirective layerType="OSM">
            <MarkersDirective>
              <MarkerDirective
                visible
                animationDuration={3}
                height={25}
                width={20}
                dataSource={sensorList}
                tooltipSettings={{
                  visible: true,
                  valuePath: "value", // Displays the "longitude" value in sensor object
                }}
              />
            </MarkersDirective>
            <NavigationLinesDirective>
              <NavigationLineDirective
                visible
                latitude={[
                  43.57125022761893,
                  43.57034852586817,
                  43.57168552708072,
                ]}
                longitude={[
                  1.4690780639648438,
                  1.465752124786377,
                  1.4675116539001465,
                ]}
                angle={0}
                width={2}
              />
            </NavigationLinesDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </Container>
  ); */
}
