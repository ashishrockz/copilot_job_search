import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  XIcon as X,
  CaretRightIcon as CaretRight,
  MagnifyingGlassIcon as MagnifyingGlass,
} from "@phosphor-icons/react";
import { getLocationHierarchy } from "@/lib/reference-data.service";
import type { LocationHierarchyItem } from "@/types/reference-data";

interface CityData {
  [country: string]: {
    [province: string]: string[];
  };
}

// Mock city/province data - replace with API data
const CITY_DATA: CityData = {
  "United States": {
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
  },
  "Canada": {
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
    "British Columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford"],
    "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert"],
  },
  "United Kingdom": {
    "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newtownabbey", "Bangor"],
  },
  "Germany": {
    "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg"],
    "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg"],
    "Berlin": ["Berlin"],
    "Hamburg": ["Hamburg"],
  },
  "France": {
    "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Villeurbanne", "Clermont-Ferrand"],
    "Nouvelle-Aquitaine": ["Bordeaux", "Limoges", "Poitiers", "La Rochelle", "Pau"],
  },
  "India": {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Delhi": ["New Delhi", "Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Maitland", "Wagga Wagga"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
    "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
    "Western Australia": ["Perth", "Mandurah", "Bunbury", "Kalgoorlie", "Geraldton"],
  },
  "Brazil": {
    "São Paulo": ["São Paulo", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "Petrópolis"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Ilhéus"],
  },
  "Japan": {
    "Tokyo": ["Tokyo", "Shibuya", "Shinjuku", "Minato", "Chiyoda"],
    "Osaka": ["Osaka", "Sakai", "Higashiosaka", "Toyonaka", "Suita"],
    "Kanagawa": ["Yokohama", "Kawasaki", "Sagamihara", "Fujisawa", "Yokosuka"],
    "Aichi": ["Nagoya", "Toyota", "Okazaki", "Ichinomiya", "Kasugai"],
  },
  "Mexico": {
    "Mexico City": ["Mexico City", "Iztapalapa", "Gustavo A. Madero", "Álvaro Obregón", "Tlalpan"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"],
    "Nuevo León": ["Monterrey", "Guadalupe", "San Nicolás de los Garza", "Apodaca", "Santa Catarina"],
    "Guanajuato": ["León", "Irapuato", "Celaya", "Salamanca", "Guanajuato"],
  },
};

interface OnsiteLocationSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectedLocations: string[]) => void;
  initialSelections?: string[];
  title: string;
  availableCountries?: string[];
}

export function OnsiteLocationSelectorModal({
  open,
  onClose,
  onSave,
  initialSelections = [],
  title,
  availableCountries = Object.keys(CITY_DATA),
}: OnsiteLocationSelectorModalProps): React.JSX.Element {
  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(null);
  const [anywhereInCountry, setAnywhereInCountry] = React.useState(false);
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>(initialSelections);
  const [expandedProvince, setExpandedProvince] = React.useState<string | null>(null);
  const [locationData, setLocationData] = React.useState<CityData>(CITY_DATA);
  const [loading, setLoading] = React.useState(false);
  const [countries, setCountries] = React.useState<string[]>(Object.keys(CITY_DATA));

  // Fetch location hierarchy data from API
  React.useEffect(() => {
    const fetchLocationData = async () => {
      setLoading(true);
      try {
        const response = await getLocationHierarchy();
        if (response.success && response.data) {
          // Transform API data to CityData format
          const transformedData: CityData = {};
          const countryList: string[] = [];

          response.data.forEach((location: LocationHierarchyItem) => {
            if (location.is_active && location.location_type === "country") {
              const countryName = location.name;
              countryList.push(countryName);

              // Group all states/cities under a single "All Locations" province
              // or we can list them directly as cities
              if (location.states && location.states.length > 0) {
                transformedData[countryName] = {
                  "All Locations": location.states.map(state => state.name)
                };
              } else {
                transformedData[countryName] = {};
              }
            }
          });

          setLocationData(transformedData);
          setCountries(countryList);
        }
      } catch (error) {
        console.error("Error fetching location hierarchy:", error);
        // Keep using CITY_DATA as fallback
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLocationData();
    }
  }, [open]);

  React.useEffect(() => {
    setSelectedLocations(initialSelections);
    // Check if "Anywhere in [Country]" is selected
    const anywherePattern = /^Anywhere in /;
    const anywhereSelection = initialSelections.find(loc => anywherePattern.test(loc));
    if (anywhereSelection) {
      const country = anywhereSelection.replace("Anywhere in ", "");
      setSelectedCountry(country);
      setAnywhereInCountry(true);
    }
  }, [initialSelections]);

  const handleProvinceClick = (province: string) => {
    setExpandedProvince(expandedProvince === province ? null : province);
  };

  const handleAnywhereToggle = () => {
    const newValue = !anywhereInCountry;
    setAnywhereInCountry(newValue);
    if (newValue && selectedCountry) {
      // Clear all city selections and set "Anywhere in [Country]"
      setSelectedLocations([`Anywhere in ${selectedCountry}`]);
    } else {
      // Clear "Anywhere in [Country]" selection
      setSelectedLocations(
        selectedLocations.filter(loc => !loc.startsWith("Anywhere in "))
      );
    }
  };

  const handleCityToggle = (city: string, province: string) => {
    const locationString = `${city}, ${province}, ${selectedCountry}`;

    if (anywhereInCountry) {
      // If "Anywhere" is selected, unselect it and select only this city
      setAnywhereInCountry(false);
      setSelectedLocations([locationString]);
    } else {
      setSelectedLocations((prev) => {
        // Remove any "Anywhere in" entries
        const filtered = prev.filter(loc => !loc.startsWith("Anywhere in "));
        return filtered.includes(locationString)
          ? filtered.filter((c) => c !== locationString)
          : [...filtered, locationString];
      });
    }
  };

  const handleSelectAllInProvince = (province: string) => {
    if (!selectedCountry || !locationData[selectedCountry]) return;

    const cities = locationData[selectedCountry][province];
    const provinceLocations = cities.map(
      city => `${city}, ${province}, ${selectedCountry}`
    );

    const allSelected = provinceLocations.every((loc) =>
      selectedLocations.includes(loc)
    );

    if (allSelected) {
      // Deselect all in province
      setSelectedLocations((prev) =>
        prev.filter((loc) => !provinceLocations.includes(loc))
      );
    } else {
      // Select all in province
      setSelectedLocations((prev) => {
        const filtered = prev.filter(loc => !loc.startsWith("Anywhere in "));
        const newSelections = [...filtered];
        provinceLocations.forEach((loc) => {
          if (!newSelections.includes(loc)) {
            newSelections.push(loc);
          }
        });
        return newSelections;
      });
      setAnywhereInCountry(false);
    }
  };

  const handleSave = () => {
    onSave(selectedLocations);
    onClose();
  };

  const handleCancel = () => {
    setSelectedLocations(initialSelections);
    setSelectedCountry(null);
    setAnywhereInCountry(false);
    setExpandedProvince(null);
    onClose();
  };

  const handleCountrySelect = (country: string | null) => {
    setSelectedCountry(country);
    setAnywhereInCountry(false);
    setExpandedProvince(null);
    // Clear selections from other countries
    setSelectedLocations([]);
  };

  const provinces = selectedCountry && locationData[selectedCountry]
    ? Object.keys(locationData[selectedCountry])
    : [];

  // Use API countries if available, otherwise fall back to availableCountries prop
  const availableCountryList = countries.length > 0 ? countries : availableCountries;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
            maxHeight: "85vh",
          },
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a" }}>
            {title}
          </Typography>
          <IconButton onClick={handleCancel} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
            <CircularProgress sx={{ color: "#7c3aed" }} />
          </Box>
        ) : (
          <>
            {/* Country Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: "0.9375rem", color: "#0f172a" }}>
                Select Country
              </Typography>
              <Autocomplete
                value={selectedCountry}
                onChange={(_, newValue) => handleCountrySelect(newValue)}
                options={availableCountryList}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search country..."
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <MagnifyingGlass size={18} style={{ marginLeft: 8, marginRight: 4, color: "#9ca3af" }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { borderColor: "#7c3aed" },
                      },
                    }}
                  />
                )}
              />
            </Box>

            {selectedCountry ? (
              <>
                {/* Anywhere in Country Option */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={anywhereInCountry}
                      onChange={handleAnywhereToggle}
                      sx={{
                        color: "#7c3aed",
                        "&.Mui-checked": { color: "#7c3aed" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                      Anywhere in {selectedCountry}
                    </Typography>
                  }
                />

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography sx={{ px: 2, color: "#64748b", fontSize: "0.875rem" }}>
                    OR
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                <Typography sx={{ mb: 2, fontWeight: 500, fontSize: "0.9375rem", color: "#0f172a" }}>
                  Select Cities
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 2, minHeight: 350 }}>
                  {/* Left Panel - Provinces/States */}
                  <Box
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "auto",
                      maxHeight: 350,
                    }}
                  >
                    <List disablePadding>
                      {provinces.map((province, index) => (
                        <React.Fragment key={province}>
                          {index > 0 && <Divider />}
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handleProvinceClick(province)}
                              selected={expandedProvince === province}
                              sx={{
                                py: 1.5,
                                "&.Mui-selected": {
                                  backgroundColor: "#f8f9fa",
                                  borderLeft: "3px solid #7c3aed",
                                },
                              }}
                            >
                              <ListItemText
                                primary={province}
                                slotProps={{
                                  primary: {
                                    sx: {
                                      fontSize: "0.875rem",
                                      fontWeight: expandedProvince === province ? 600 : 500,
                                    }
                                  }
                                }}
                              />
                              <CaretRight
                                size={16}
                                style={{
                                  transform: expandedProvince === province ? "rotate(90deg)" : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>

                  {/* Right Panel - Cities */}
                  <Box
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "auto",
                      maxHeight: 350,
                      p: 2,
                    }}
                  >
                    {expandedProvince ? (
                      <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                            {expandedProvince}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => handleSelectAllInProvince(expandedProvince)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8125rem",
                              color: "#7c3aed",
                              "&:hover": { backgroundColor: "#ede9fe" },
                            }}
                          >
                            {locationData[selectedCountry][expandedProvince].every((city) => {
                              const locationString = `${city}, ${expandedProvince}, ${selectedCountry}`;
                              return selectedLocations.includes(locationString);
                            })
                              ? "Deselect All"
                              : `Select all in ${expandedProvince}`}
                          </Button>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          {locationData[selectedCountry][expandedProvince].map((city) => {
                            const locationString = `${city}, ${expandedProvince}, ${selectedCountry}`;
                            return (
                              <FormControlLabel
                                key={city}
                                control={
                                  <Checkbox
                                    checked={selectedLocations.includes(locationString)}
                                    onChange={() => handleCityToggle(city, expandedProvince)}
                                    size="small"
                                    sx={{
                                      color: "#cbd5e1",
                                      "&.Mui-checked": { color: "#7c3aed" },
                                    }}
                                  />
                                }
                                label={
                                  <Typography sx={{ fontSize: "0.875rem" }}>
                                    {city}
                                  </Typography>
                                }
                                sx={{ m: 0 }}
                              />
                            );
                          })}
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#94a3b8",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          Select a state/province to view cities
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Selected Count */}
                <Box sx={{ mt: 2, p: 2, backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
                    <strong>{selectedLocations.length}</strong> location
                    {selectedLocations.length !== 1 ? "s" : ""} selected
                    {selectedLocations.length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        ({selectedLocations.slice(0, 2).map(loc =>
                          loc.startsWith("Anywhere in ") ? loc : loc.split(", ")[0]
                        ).join(", ")}
                        {selectedLocations.length > 2 && ` +${selectedLocations.length - 2} more`})
                      </span>
                    )}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 300,
                  color: "#94a3b8",
                }}
              >
                <Typography sx={{ fontSize: "0.875rem" }}>
                  Please select a country to continue
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          sx={{
            textTransform: "none",
            color: "#64748b",
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedLocations.length === 0}
          sx={{
            textTransform: "none",
            backgroundColor: "#7c3aed",
            "&:hover": { backgroundColor: "#6d28d9" },
            "&:disabled": { backgroundColor: "#cbd5e1" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}