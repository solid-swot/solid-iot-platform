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
  // eslint-disable-next-line import/no-unresolved
} from "@syncfusion/ej2-react-maps";
import { Container } from "@material-ui/core";
import { Thing } from "@inrupt/solid-client";
import sensorList from "../pollution/datatreater";

export default function SensorMap(): React.ReactElement {
  let sensors: { number }[];
  sensors = [];
  // eslint-disable-next-line no-void,func-names
  // @ts-ignore
  // eslint-disable-next-line no-void
  void sensorList().then(function (response: { number; number }[]) {
    sensors = response;
    console.log("pos : ", sensors);
  });

  return (
    <Container>
      <MapsComponent
        id="maps"
        zoomSettings={{ zoomFactor: 15 }}
        centerPosition={{ latitude: 43.57079, longitude: 1.46625 }}
      >
        <Inject services={[Marker]} />
        <LayersDirective>
          <LayerDirective layerType="OSM">
            <MarkersDirective>
              <MarkerDirective
                visible
                height={25}
                width={20}
                dataSource={sensors}
              />
            </MarkersDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </Container>
  );
}
