import { useState, useEffect, CSSProperties } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import ReactPaginate from "react-paginate";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import { SyncLoader } from "react-spinners";
import {Slider} from "@mui/material";
import "./style.css";

export default function PaginatedItems() {
  const [itemOffset, setItemOffset] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("lowToHigh");
  const [priceRange, setPriceRange] = useState({ from: 0, to: 10000 });
  const [occupancy, setOccupancy] = useState(2);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    let page = 1;
    const perPage = 100;
    let allData = [];
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await axios.get(
          `https://api.elixirtrips.com/wp-json/wp/v2/hotels?per_page=${perPage}&page=${page}`
        );
        const data = response.data;
        if (data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < 100) hasMoreData = false;
          page += 1;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        hasMoreData = false;
      }
    }
    setHotels(allData);
    setFilteredHotels(allData);
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Handle filtering, searching, sorting, and occupancy filter
  useEffect(() => {
    let filtered = [...hotels];

    // Search by hotel name and address
    if (searchQuery) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.acf.hotel_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          hotel.acf.hotel_address
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (hotel) =>
        hotel.acf["rate-per-night"] >= priceRange.from &&
        hotel.acf["rate-per-night"] <= priceRange.to
    );

    // Filter by occupancy
    filtered = filtered.filter(
      (hotel) => hotel.acf.occupancy >= occupancy
    );

    // Sort by price range
    if (sortOption === "lowToHigh") {
      filtered = filtered.sort(
        (a, b) => a.acf["rate-per-night"] - b.acf["rate-per-night"]
      );
    } else if (sortOption === "highToLow") {
      filtered = filtered.sort(
        (a, b) => b.acf["rate-per-night"] - a.acf["rate-per-night"]
      );
    }

    setFilteredHotels(filtered);
  }, [searchQuery, sortOption, priceRange, occupancy, hotels]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredHotels.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredHotels.length / itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredHotels.length;
    setItemOffset(newOffset);
  };

  const handlePriceChange = (key, value) => {
    setPriceRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ padding: "20px 0" }}>
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
    marginBottom: 3,
  }}
>
  <TextField
    label="Search by Hotel Name or Address"
    variant="outlined"
    size="small"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    sx={{ minWidth: 200 }}
  />

  <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
    <InputLabel>Sort by Price</InputLabel>
    <Select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      label="Sort by Price"
    >
      <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
      <MenuItem value="highToLow">Price: High to Low</MenuItem>
    </Select>
  </FormControl>

  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
    <InputLabel>Occupancy</InputLabel>
    <Select
      value={occupancy}
      onChange={(e) => setOccupancy(e.target.value)}
      label="Occupancy"
    >
      {[2, 3, 4, 5, 6].map((value) => (
        <MenuItem key={value} value={value}>
          {value}+
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
  <Typography gutterBottom>Price Range</Typography>
  
  <Box sx={{ width: 200, padding: "0 10px" }}>
    <Slider
      value={[priceRange.from, priceRange.to]}
      onChange={(e, newValue) => setPriceRange({ from: newValue[0], to: newValue[1] })}
      valueLabelDisplay="auto"
      min={0}
      max={10000}
      step={100}
      sx={{ marginBottom: 2 }}
    />
  </Box>

  <TextField
    label="From"
    type="number"
    variant="outlined"
    size="small"
    value={priceRange.from}
    onChange={(e) => handlePriceChange("from", Number(e.target.value))}
    sx={{ width: 100 }}
  />
  <TextField
    label="To"
    type="number"
    variant="outlined"
    size="small"
    value={priceRange.to}
    onChange={(e) => handlePriceChange("to", Number(e.target.value))}
    sx={{ width: 100 }}
  />
</Box>
</Box>


        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <SyncLoader loading={loading} size={15} speedMultiplier={1} />
            </Box>
          ) : (
            currentItems.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          )}
        </Box>

        {!loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              marginTop: 3,
            }}
          >
            <FormControl variant="outlined" size="small">
              <InputLabel>Items per page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items per page"
              >
                {[10, 20, 30, 40, 50, 100].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

           <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            activeClassName="active"
          />
          </Box>
        )}
      </Container>
    </>
  );
}


function HotelCard({ hotel }) {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const { data } = await axios.get(hotel._links["wp:attachment"][0].href);
    const res = data.map((im) => im.source_url);
    setImages(res);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "10px 0",
        padding: "10px",
        boxShadow: 3,
      }}
    >
      <IconButton
        component={Link}
        to={`/hotel-details/${hotel.id}`}
        state={{ hotel, images }}
        sx={{ position: "absolute" }}
      >
        <AddCircleIcon fontSize="large" color="primary" />
      </IconButton>

      <CardMedia
        component="img"
        alt={hotel.acf.hotel_name}
        height="150"
        image={images[0]}
        sx={{ width: 200, cursor: "pointer" }}
      />
      {/* <Box
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: 1,
        }}
      >
        {images.length > 1 ? `+${images.length - 1}` : ""}
      </Box> */}

      <CardContent sx={{ flex: 1, paddingLeft: 2 }}>
        <Typography gutterBottom variant="h6">
          {hotel.acf.hotel_name}
        </Typography>
        <Typography gutterBottom variant="subtitle2" color="text.secondary">
          {hotel.acf.hotel_address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {truncateText(
            hotel.acf.hotel_description || "No description available.",
            100
          )}
        </Typography>
      </CardContent>

      <Box sx={{ textAlign: "right", width: 150 }}>
        <Typography variant="body2">
          <strong>Rating:</strong> {hotel.acf.hotel_rating || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Price Range:</strong> ₹{hotel.acf["rate-per-night"] || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Occupancy:</strong> {hotel.acf.occupancy || "N/A"}
        </Typography>
        <CardActions>
          <Button
            component={Link}
            to={`/hotel-details/${hotel.id}`}
            state={{ hotel, images }}
            size="small"
          >
            See More
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
