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

import { useSession, LogoutButton } from "@inrupt/solid-ui-react/dist";
import { Box, Button, Container } from "@material-ui/core";
import React from "react";
import LoginForm from "../components/loginForm";
import Profile from "../components/profile";
import SensorData from "../components/sensorData";
import RouteData from "../components/routeData";
import PollutionFetcher from "../components/pollution";
import SensorMap from "../components/sensorMap";

export default function Home(): React.ReactElement {
  const { session } = useSession();

  if (!session.info.isLoggedIn) {
    return (
      <Container>
        <LoginForm />
        <SensorMap route={{ latitudes: [], longitudes: [] }} sensors={[]} />
      </Container>
    );
  }

  return (
    <Container>
      <Box style={{ marginBottom: 16, textAlign: "right" }}>
        <LogoutButton>
          <Button variant="contained" color="primary">
            Log&nbsp;out
          </Button>
        </LogoutButton>
      </Box>
      <RouteData />
    </Container>
  );

  /* if (!session.info.isLoggedIn) {
    return (
      <Container>
        <LoginForm />
        <SensorData route={{ latitudes: [], longitudes: [] }} />
      </Container>
    );
  }

  const route = {
    latitudes: [43.57125022761893, 43.57034852586817, 43.57168552708072],
    longitudes: [1.4690780639648438, 1.465752124786377, 1.4675116539001465],
  };

  return (
    <Container>
      <Box style={{ marginBottom: 16, textAlign: "right" }}>
        <LogoutButton>
          <Button variant="contained" color="primary">
            Log&nbsp;out
          </Button>
        </LogoutButton>
      </Box>
      <SensorData route={route} />
    </Container>
  );
  /* return (
    <Container>
      <Box style={{ marginBottom: 16, textAlign: "right" }}>
        <LogoutButton>
          <Button variant="contained" color="primary">
            Log&nbsp;out
          </Button>
        </LogoutButton>
      </Box>
      <RouteData />
    </Container>
  ); */
}
