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

// tslint:disable
import * as React from "react";
import * as ReactDOM from "react-dom";
// @ts-ignore
import {
  MapsComponent,
  LayersDirective,
  LayerDirective,
  MarkersDirective,
  MarkerDirective,
  Marker,
  Inject,
  MapsTooltip,
  // eslint-disable-next-line import/no-unresolved
} from "@syncfusion/ej2-react-maps";
import { Container } from "@material-ui/core";
import { getDecimal, getThingAll, Thing } from "@inrupt/solid-client";
import { useDataset } from "@inrupt/solid-ui-react";

export default function SensorMap(): React.ReactElement {
  const pollutionURI = "https://solid.luxumbra.fr/iot/sensors.ttl";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { dataset, error } = useDataset(pollutionURI);
  if (error) return <div>failed to load</div>;
  if (!dataset) return <div>loading...</div>;
  const things = getThingAll(dataset);
  const sensors: { latitude: number; longitude: number }[] = [];
  // eslint-disable-next-line func-names
  things.forEach(function (thing) {
    const lat: number = getDecimal(thing, "http://schema.org/latitude");
    const long: number = getDecimal(thing, "http://schema.org/longitude");
    sensors.push({ latitude: lat, longitude: long });
    // console.log(`Sensor position : x = ${longitude} y = ${latitude}`);
    console.log("sensors est : ", sensors);
  });
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
                dataSource={sensors}
                tooltipSettings={{
                  visible: true,
                  valuePath: "longitude", // Displays the "longitude" value in sensor object
                }}
              />
            </MarkersDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </Container>
  );
}
