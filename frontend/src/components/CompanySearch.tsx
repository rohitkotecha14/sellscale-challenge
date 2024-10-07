import React from 'react';
import { Autocomplete, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

interface CompanySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  companyMatches: any[];
  setTicker: (value: string) => void;
  loading: boolean;
  handleSearch: () => void;
  searchLimitReached: boolean;
}

const CompanySearch: React.FC<CompanySearchProps> = ({
  searchTerm,
  setSearchTerm,
  companyMatches,
  setTicker,
  loading,
  handleSearch,
  searchLimitReached,
}) => {
  const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    setSearchTerm(newInputValue);
    if (searchLimitReached) {
      // If the search limit is reached, directly set the typed value as the ticker
      setTicker(newInputValue.toUpperCase());
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
    // Ensure ticker is set when a company is selected from dropdown
    if (!searchLimitReached && newValue) {
      const selectedCompany = companyMatches.find(company => `${company.name} (${company.symbol})` === newValue);
      if (selectedCompany) {
        // Ensure ticker is properly set and passed to the parent
        setTicker(selectedCompany.symbol.toUpperCase());
        // Optionally call handleSearch directly here if you want to fetch details immediately on selection
        handleSearch();
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={searchLimitReached 
        ? [] // No suggestions when search limit is reached
        : companyMatches.map((company) => `${company.name} (${company.symbol})`)}  // Options displayed in autocomplete dropdown
      onInputChange={handleInputChange}
      onChange={handleSelectChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={searchLimitReached ? "Search by Ticker" : "Search by Company"}
          helperText={searchLimitReached ? "Company search limit reached, switching to ticker search" : ""}
          FormHelperTextProps={{ sx: { color: "#34be10" } }}  // Change helper text color to green
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} disabled={loading || !searchTerm}>
                    <SearchIcon sx={{ color: "#34be10" }} />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
          sx={{
            marginBottom: 2,
            backgroundColor: "#0d2d13",
            borderRadius: 2,
            "& .MuiInputBase-input": { color: "#34be10" },  // Change input text color to green
            "& .MuiInputLabel-root": { color: "#34be10" },  // Change label color to green
            "& .MuiAutocomplete-clearIndicator": { color: "#34be10" },  // Change clear "X" icon to green
            "& .MuiAutocomplete-popupIndicator": { color: "#34be10" },  // Change dropdown arrow to green
          }}
        />
      )}
    />
  );
};

export default CompanySearch;
