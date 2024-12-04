import Image from "next/image";
import { Box } from "@mui/material";
import Footer from "../Footer";
import Logo from "../Logo";
import CurvedArrow from "../Icons/CurvedArrow";
import PerconaLogo from "public/assets/images/logos/percona-logo.svg";

const MainImageLayout = ({
  orgName,
  orgLogoURL,
  showArrow,
  children,
  contentMaxWidth = 480,
}) => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="1fr 1fr" height="100%">
        {/* Image Box */}
        <Box
          sx={{
            boxShadow: "0px 12px 16px -4px #10182814",
            backgroundImage: "url('/assets/images/non-dashboard/bg-main.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Box
          sx={{
            position: "relative", // For the Footer
            display: "grid",
            placeItems: "center",
            padding: "24px 55px 60px",
          }}
        >
          <Box maxWidth={contentMaxWidth} width="100%" mx="auto">
            {/* Logo */}
            <Box
              position="relative" // For the Curved Arrow
              textAlign="center"
            >
              {showArrow && (
                <CurvedArrow
                  style={{ position: "absolute", top: "-80px", left: "0px" }}
                />
              )}

              {orgLogoURL ? (
                <Logo src={orgLogoURL} alt={orgName} />
              ) : (
                <Image alt={orgName} src={PerconaLogo} />
              )}
            </Box>
            {children}
          </Box>
          <Footer orgName={orgName} />
        </Box>
      </Box>
    </>
  );
};

export default MainImageLayout;
