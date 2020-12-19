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

import { useState } from "react";

import {
  useSession,
  CombinedDataProvider,
  Image,
  LogoutButton,
  Text,
  Value,
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

import BusinessIcon from "@material-ui/icons/Business";

import {
  SCHEMA_INRUPT_EXT,
  RDFS,
  FOAF,
  VCARD,
} from "@inrupt/lit-generated-vocab-common";

export default function LoginForm(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const [editing, setEditing] = useState(false);
  const sensorData = "https://solid.luxumbra.fr/iot/sensors.ttl";
  const sensor001Thing = "https://solid.luxumbra.fr/iot/sensors.ttl#sensor-001";

  return (
    <Container fixed>
      <CombinedDataProvider datasetUrl={sensorData} thingUrl={sensor001Thing}>
        <Card style={{ maxWidth: 480 }}>
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Container>
                <Value
                  dataType="decimal"
                  property="http://schema.org/latitude"
                />
              </Container>
              <Container>
                <Value
                  dataType="decimal"
                  property="http://schema.org/longitude"
                />
              </Container>
            </Typography>
          </CardContent>

          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => setEditing(!editing)}
            >
              Refresh
            </Button>
          </CardActions>
        </Card>
      </CombinedDataProvider>
    </Container>
  );
}
