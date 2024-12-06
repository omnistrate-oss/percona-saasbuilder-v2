import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";

const SubmitButton = ({ children, loading, ...restProps }) => (
  <Button {...restProps}>
    {children}
    {loading && <LoadingSpinnerSmall />}
  </Button>
);

export default SubmitButton;
