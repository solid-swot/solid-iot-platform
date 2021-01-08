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

import * as React from "react";
import {
  MapsComponent,
  LayersDirective,
  LayerDirective,
  MarkersDirective,
  MarkerDirective,
  Marker,
  Inject,
  MapsTooltip,
  NavigationLine,
  NavigationLineDirective,
  NavigationLinesDirective,
} from "@syncfusion/ej2-react-maps";
import { Container } from "@material-ui/core";

/**
 * Prop issue that could to be fixed but not the priority
 * @param prop
 * @constructor
 */
export default function SensorMap(prop): React.ReactElement {
  console.log("Map sensors are : ", prop.sensors);
  return (
    <Container>
      <MapsComponent
        id="maps"
        zoomSettings={{ zoomFactor: 15 }}
        centerPosition={{ latitude: 43.57079, longitude: 1.46625 }}
      >
        <Inject services={[Marker, MapsTooltip, NavigationLine]} />
        <LayersDirective>
          <LayerDirective layerType="OSM">
            <MarkersDirective>
              <MarkerDirective
                visible
                animationDuration={3}
                height={25}
                width={20}
                dataSource={prop.sensors}
                tooltipSettings={{
                  visible: true,
                  valuePath: "value",
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
  );
  /* return (
    <Container>
      <MapsComponent
        id="maps"
        zoomSettings={{
          zoomFactor: 15,
          enable: true,
          toolbars: ["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"],
        }}
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
                dataSource={prop.sensors}
                tooltipSettings={{
                  visible: true,
                  valuePath: "value", // Displays the "longitude" value in sensor object
                }}
              />
            </MarkersDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </Container>
  ); */
}
