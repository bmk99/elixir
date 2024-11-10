import React from "react";
import { AppBar, Toolbar, Typography, Button, CssBaseline, Container } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      {/* <CssBaseline /> */}
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            MyWebsite
          </Typography>
          {/* <Link to="/">HOTELS </Link> */}
          <Button color="inherit" component={Link} to="/">Home</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
