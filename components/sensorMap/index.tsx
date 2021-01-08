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
  Zoom,
} from "@syncfusion/ej2-react-maps";
import { Container } from "@material-ui/core";

/**
 * Prop issue that could to be fixed but not the priority
 * @param prop
 * @constructor
 */
export default function SensorMap(prop): React.ReactElement {
  console.log("SENSOR MAP : sensors are : ", prop.sensors);
  return (
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
        <Inject services={[Marker, MapsTooltip, NavigationLine, Zoom]} />
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
                latitude={prop.route.latitudes}
                longitude={prop.route.longitudes}
                angle={0}
                width={2}
              />
            </NavigationLinesDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </Container>
  );
}
