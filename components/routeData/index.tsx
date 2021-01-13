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
import { useDataset, useSession } from "@inrupt/solid-ui-react";
import { getDecimal, getThingAll } from "@inrupt/solid-client";
import { Container } from "@material-ui/core";
import SensorMap from "../sensorMap";
import SensorData from "../sensorData";
import { privateDataDirUri } from "../../pages";

export default function RouteData(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const routeURI = `${privateDataDirUri}tourINSA.ttl`;
  const route = {
    latitudes: [],
    longitudes: [],
  };
  const { dataset, error } = useDataset(routeURI);
  if (error) {
    console.log("Erreur de Dataset");
    return (
      <Container>
        <SensorData route={route} />
      </Container>
    );
  }
  if (!dataset) return <div>loading...</div>;
  const things = getThingAll(dataset);
  things.forEach(function (thing) {
    const latitude = getDecimal(thing, "http://schema.org/latitude");
    const longitude = getDecimal(thing, "http://schema.org/longitude");
    route.latitudes.push(latitude);
    route.longitudes.push(longitude);
  });

  return <SensorData route={route} />;
}
