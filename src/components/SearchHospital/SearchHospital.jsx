import { MenuItem, Select, Button, InputAdornment, Box } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchHospital() {
  const [states, setStates] = useState([]); // State to hold the list of states
  const [cities, setCities] = useState([]); // State to hold the list of cities based on selected state
  const [formData, setFormData] = useState({ state: "", city: "" }); // State to track selected state and city
  const navigate = useNavigate();

  // Fetch states from backend on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://meddata-backend.onrender.com/states"
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities based on selected state
  useEffect(() => {
    const fetchCities = async () => {
      setCities([]); // Clear cities when state changes
      setFormData((prev) => ({ ...prev, city: "" })); // Reset city when state changes
      if (formData.state !== "") {
        try {
          const { data } = await axios.get(
            `https://meddata-backend.onrender.com/cities/${formData.state}`
          );
          setCities(data); // Update city options based on the selected state
        } catch (error) {
          console.log("Error fetching cities:", error);
        }
      }
    };

    fetchCities();
  }, [formData.state]);

  // Handle change of state and city select fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.state && formData.city) {
      // Navigate to the search route with state and city parameters
      navigate(`/search?state=${formData.state}&city=${formData.city}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 4,
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" }, // Responsive design
      }}
    >
      {/* State Select */}
      <Select
        displayEmpty
        id="state"
        name="state"
        value={formData.state}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        required
        sx={{ minWidth: 200, width: "100%" }}
      >
        <MenuItem disabled value="" selected>
          State
        </MenuItem>
        {states.map((state) => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))}
      </Select>

      {/* City Select (Disabled until a state is selected) */}
      <Select
        displayEmpty
        id="city"
        name="city"
        value={formData.city}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        required
        sx={{ minWidth: 200, width: "100%" }}
        disabled={!formData.state} // Disable city select if no state is selected
      >
        <MenuItem disabled value="" selected>
          City
        </MenuItem>
        {cities.map((city) => (
          <MenuItem key={city} value={city}>
            {city}
          </MenuItem>
        ))}
      </Select>

      {/* Search Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={<SearchIcon />}
        sx={{ py: "15px", px: 8, flexShrink: 0 }}
        disableElevation
      >
        Search
      </Button>
    </Box>
  );
}
