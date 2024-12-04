import { useState } from "react";
import Generator from "generate-password";
import { InputAdornment, Tooltip, Box, TextField } from "@mui/material";

import KeyIcon from "src/components/Icons/Key/KeyIcon";
import { Text } from "src/components/Typography/Typography";
import { styleConfig } from "src/providerConfig";

const PasswordField = (props) => {
  const {
    disabled = false,
    value,
    dataCy,
    showPasswordGenerator,
    sx = {},
    ...restProps
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextField
      data-cy={dataCy || "password-field"}
      type={isPasswordVisible ? "text" : "password"}
      value={value}
      disabled={disabled}
      sx={{
        ".MuiOutlinedInput-root": {
          borderRadius: "6px",
          fontSize: "14px",
          color: "#111827",
          fontWeight: "500",
          boxShadow: "0px 1px 2px 0px #1018280D",
          paddingRight: "0",
          "& .MuiOutlinedInput-input": {
            padding: "10px 12px",
            backgroundColor: "#FFF",
            "&::placeholder": {
              fontSize: "14px",
              color: "#9CA3AF",
            },
          },
        },
        ".MuiInputAdornment-root": {
          border: "none",
          paddingRight: 0,
        },
        ...sx,
      }}
      {...restProps}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Text
              size="xsmall"
              weight="medium"
              style={{
                color: styleConfig.primaryColor,
                cursor: "pointer",
                userSelect: "none",
                paddingRight: "12px",
                width: "46px",
                textAlign: "center",
              }}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
            {showPasswordGenerator && (
              <Tooltip title="Password Generator" placement="top-end" arrow>
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: "15px",
                    backgroundColor: "#F9F5FF",
                    height: "100%",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "1px solid #D0D5DD",
                  }}
                  onClick={() => {
                    const password = Generator.generate({
                      length: 12,
                      numbers: true,
                    });

                    restProps.onChange?.({
                      target: {
                        name: restProps.name,
                        value: password,
                      },
                    });
                  }}
                >
                  <KeyIcon />
                </Box>
              </Tooltip>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};
export default PasswordField;
