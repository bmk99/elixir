import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { CardActions } from "@mui/material";

export default function Hotel() {
  const { state } = useLocation();
  const { hotel, images } = state; // Access hotel data passed from HotelCard
  const [openDialog, setOpenDialog] = useState(false);
  console.log(hotel)
  console.log(images)

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  return (
    <Container maxWidth="md" sx={{ padding: "20px 0" }}>
      {/* Top Images Section */}
      <Paper
        elevation={4}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          marginBottom: 4,
        }}
      >
        <Badge
          badgeContent={`+${images.length} Images`}
          color="primary"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            position: "absolute",
            bottom: 30,
            right: 30,
            // backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            borderRadius: "50%",
            padding: "15px 25px",
            fontSize: "50px",
            zIndex: 1,
            cursor: "pointer",
            minwidth: "87px",
          lineHeight: "1",
           height: "60px"
          }}
          onClick={handleDialogOpen}
        />
        <CardMedia
          component="img"
          alt={hotel.hotel_name}
          image={images[0]}
          sx={{ width: "100%", height: 300, objectFit: "cover", cursor: "pointer" }}
          onClick={handleDialogOpen}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {images.map((img, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <CardMedia component="img" src={img} alt={`Image ${index + 1}`} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Hotel Details Section */}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom>
          {hotel.acf.hotel_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {hotel.acf.hotel_address}
        </Typography>
        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Rating:</strong> {hotel.acf.hotel_rating || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Price Range:</strong> {hotel.acf["rate-per-night"] || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Occupancy:</strong> {hotel.acf.occupancy || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Amenities Section */}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Amenities
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            color: "text.secondary",
          }}
          dangerouslySetInnerHTML={{ __html: hotel.acf.hotel_amenities }}
        />
      </Paper>

      {/* Hotel Description Section */}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Divider sx={{ marginY: 1 }} />
        <Typography variant="body2">
          {hotel.acf.hotel_description || "No description available."}
        </Typography>
      </Paper>

      <CardActions sx={{ justifyContent: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="contained" size="large">Go Back</Button>
        </Link>
      </CardActions>
    </Container>
  );
}
