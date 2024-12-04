import { Box, IconButton, Stack, popoverClasses, styled } from "@mui/material";
import { addMonths, format, subMonths } from "date-fns";
import { FC, useMemo, useState } from "react";
import {
  DateRangePicker as ReactDateRangePicker,
  Range,
} from "react-date-range";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "react-date-range/dist/styles.css"; // main css file
import Button from "../Button/Button";
import CalendarIcon from "../Icons/Calendar/Calendar";
import { SetState } from "src/types/common/reactGenerics";
import MuiPopover from "@mui/material/Popover";
import { styleConfig } from "src/providerConfig";

const Popover = styled(MuiPopover)({
  [`& .${popoverClasses.paper}`]: {
    border: "1px solid #F2F4F7",
    borderRadius: "8px",
    boxShadow: `0px 8px 8px -4px #10182808, 
  0px 20px 24px -4px #10182814`,
    display: "inline-block",
  },
});

const NavigationRenderer = (
  currentFocusedDate: Date,
  // eslint-disable-next-line no-unused-vars
  setShownDate: (shownDate: Date) => void
) => {
  return (
    <Box position="relative" width="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        position="absolute"
        top="24px"
        left="0px"
        right="0px"
      >
        <IconButton
          onClick={() => {
            setShownDate(subMonths(currentFocusedDate, 1));
          }}
          sx={{ color: "#667085" }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setShownDate(addMonths(currentFocusedDate, 1));
          }}
          sx={{ color: "#667085" }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

const SelectedDate = styled(Box)({
  padding: "10px 14px",
  border: "1px solid #D0D5DD",
  borderRadius: "8px",
  boxShadow: "0px 1px 2px 0px #1018280D",
  fontSize: "14px",
  lineHeight: "20px",
  minWidth: "126px",
  minHeight: "42px",
  background: "rgba(0,0,0,0.03)",
  color: "rgba(0,0,0,0.65)",
  fontWeight: 500,
  textAlign: "center",
});

type DateRangePickerProps = {
  dateRange: Range | null;
  setDateRange: SetState<Range>;
};

export const initialRangeState: Range = {
  startDate: null,
  endDate: null,
  key: "selection",
};

const DateRangePicker: FC<DateRangePickerProps> = (props) => {
  const { dateRange, setDateRange } = props;
  const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<Range>(dateRange);

  //meant to be used on the widget menu
  let formattedSelectedStartDate = "Select Start Date";
  if (selectedDateRange?.startDate) {
    formattedSelectedStartDate = format(
      selectedDateRange.startDate,
      "MMM d, yyyy"
    );
  }
  //meant to be used on the widget menu

  let formattedSelectedEndDate = "Select End Date";
  if (selectedDateRange?.endDate) {
    formattedSelectedEndDate = format(selectedDateRange.endDate, "MMM d, yyyy");
  }

  //meant to be used on the button
  let formattedStartDate = "Select Start Date";
  if (dateRange?.startDate) {
    formattedStartDate = format(dateRange.startDate, "MMM d, yyyy");
  }

  //meant to be used on the button
  let formattedEndDate = "Select End Date";
  if (dateRange?.endDate) {
    formattedEndDate = format(dateRange.endDate, "MMM d, yyyy");
  }

  let buttonText = "Filter by Date";

  if (dateRange?.startDate && dateRange?.endDate) {
    buttonText = `${formattedStartDate}-${formattedEndDate}`;
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorElem((prev) => {
      if (prev) return null;
      else return event.currentTarget;
    });
  }

  const dateRanges: Range[] = useMemo(() => {
    return [{ ...selectedDateRange, key: "selection" }];
  }, [selectedDateRange]);

  function handleAppply() {
    setDateRange(selectedDateRange);
    setAnchorElem(null);
  }

  function handleCancel() {
    setSelectedDateRange(initialRangeState);
    setDateRange(initialRangeState);
    setAnchorElem(null);
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CalendarIcon color="#344054" />}
        onClick={handleButtonClick}
        sx={{
          fontWeight: "500 !important",
          color: "#344054 !important",
          height: "40px !important",
          padding: "10px 14px !important",
        }}
      >
        {buttonText}
      </Button>

      <Popover
        open={Boolean(anchorElem)}
        anchorEl={anchorElem}
        onClose={() => {
          setAnchorElem(null);
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "8px" }}
      >
        <Box>
          <ReactDateRangePicker
            onChange={(item) => {
              setSelectedDateRange(item.selection);
            }}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={dateRanges}
            direction="horizontal"
            color={styleConfig.primaryColor}
            showMonthAndYearPickers={false}
            navigatorRenderer={NavigationRenderer}
            showDateDisplay={false}
            inputRanges={[]}
          />
          <Stack
            direction="row"
            marginLeft="191px"
            borderLeft="1px solid #eff2f7"
            minHeight="50px"
            padding="16px"
            justifyContent="space-between"
            alignItems="center"
            fontSize="16px"
            lineHeight="24px"
          >
            <Stack direction="row" gap="8px" alignItems="center">
              <SelectedDate>{formattedSelectedStartDate}</SelectedDate>-
              <SelectedDate>{formattedSelectedEndDate}</SelectedDate>
            </Stack>
            <Stack direction="row" gap="8px">
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAppply}>
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangePicker;
