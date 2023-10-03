import Box from "@mui/material/Box";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function BasicSelect({ values, label, value, onChange }) {
    return (
        <Box sx={{ minWidth: 120, border: '1px solid #ccc', borderRadius: '4px' }}>
            <FormControl>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label={label}
                    onChange={onChange}
                >
                    {values.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
