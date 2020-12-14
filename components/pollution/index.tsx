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

import React, { useState } from "react";

import {
    useSession,
    CombinedDataProvider,
    Image,
    LogoutButton,
    Text,
    Value, useDataset,
} from "@inrupt/solid-ui-react";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import Profile from "../profile";
import {getDecimal, getSolidDataset, getThing, getThingAll} from "@inrupt/solid-client";

export default function PollutionFetcher(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const pollutionURI = "https://solid.luxumbra.fr/iot/sensors.ttl";
  const [editing, setEditing] = useState(false);


  function sensorList() {
      const { dataset, error } = useDataset(pollutionURI);
      //const { ds, serverRessourceInfo} = getSolidDataset(pollutionURI);
      const things = getThingAll(dataset);
      let sensors = []
      things.forEach(function(thing) {
          let latitude = getDecimal(thing,"http://schema.org/latitude")
          let longitude = getDecimal(thing,"http://schema.org/longitude")
          sensors.push({latitude, longitude});
      });
      if (error) return <div>failed to load</div>;
      if (!dataset) return <div>loading...</div>;
      return sensors;
  }

  console.log(sensorList());

  return (
      <Container fixed>
        <Profile />
        <Box style={{ marginBottom: 16, textAlign: "right" }}>
          <LogoutButton>
            <Button variant="contained" color="primary">
              Log&nbsp;out
            </Button>
          </LogoutButton>
        </Box>
        <CombinedDataProvider datasetUrl={pollutionURI} thingUrl={pollutionURI + "#sensor-001"}>
          <Value
              autosave={false}
              dataType="decimal"
              edit={false}
              inputProps={{
                className: 'test-class',
                name: 'test-name'
              }}
              onError={function noRefCheck(){}}
              onSave={function noRefCheck(){}}
              property="http://schema.org/latitude"
          />
        </CombinedDataProvider>
      </Container>
  );
}
