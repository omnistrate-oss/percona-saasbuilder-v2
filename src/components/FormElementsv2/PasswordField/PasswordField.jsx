import { useState } from "react";
import Generator from "generate-password";
import { InputAdornment, Box } from "@mui/material";

import TextField from "../TextField/TextField";
import KeyIcon from "src/components/Icons/Key/KeyIcon";
import { Text } from "src/components/Typography/Typography";
import Tooltip from "src/components/Tooltip/Tooltip";

export const PasswordField = (props) => {
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
        "& .MuiInputAdornment-root": {
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
                color: "#7F56D9",
                cursor: "pointer",
                userSelect: "none",
                paddingRight: "14px",
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
