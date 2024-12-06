import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSnackbar from "src/hooks/useSnackbar";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import PageDescription from "components/NonDashboardComponents/PageDescription";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import CenterContentLayout from "components/NonDashboardComponents/Layout/CenterContentLayout";
import { customerUserResetPassword } from "src/api/customer-user";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import { Text } from "src/components/Typography/Typography";
import { styleConfig } from "src/providerConfig";

import Confetti from "public/assets/images/non-dashboard/confetti.svg";
import Image from "next/image";
import Button from "src/components/Button/Button";
import SubmitButton from "src/components/NonDashboardComponents/FormElementsV2/SubmitButton";

const resetPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordPage = (props) => {
  const { orgName, orgLogoURL, googleReCaptchaSiteKey, isReCaptchaSetup } =
    props;
  const snackbar = useSnackbar();
  const reCaptchaRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetPasswordMutation = useMutation(
    (payload) => {
      setShowSuccess(false);
      return customerUserResetPassword(payload);
    },
    {
      onSuccess: () => {
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        setShowSuccess(true);
      },
      onError: (error) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          snackbar.showError(errorMessage);
        }
      },
    }
  );

  async function handleFormSubmit(values) {
    const data = {};

    if (reCaptchaRef.current && !hasCaptchaErrored) {
      const token = await reCaptchaRef.current.executeAsync();
      reCaptchaRef.current.reset();
      data["reCaptchaToken"] = token;
    }

    for (const key in values) {
      if (values[key]) {
        data[key] = values[key];
      }
    }
    resetPasswordMutation.mutate(data);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validationSchema: resetPasswordValidationSchema,
  });

  const { values, touched, errors, handleChange, handleBlur } = formik;

  if (showSuccess) {
    return (
      <CenterContentLayout orgName={orgName} pageTitle="Reset Password">
        <Image
          src={Confetti}
          alt="Confetti"
          width={265}
          height={140}
          style={{ margin: "0 auto" }}
        />

        <Stack gap="16px">
          <DisplayHeading>
            Check Your Email for a Password Reset Link
          </DisplayHeading>
          <PageDescription>
            If an account is associated with the provided email, a password
            reset link will be sent. Please follow the instructions to reset
            your password.
          </PageDescription>
        </Stack>
        <Button variant="contained" href="/signin">
          Go to Login
        </Button>

        <Text
          size="small"
          weight="medium"
          color="#4B5563"
          style={{ textAlign: "center" }}
        >
          Didn&apos;t get a reset password link?{" "}
          <span
            onClick={() => setShowSuccess(false)}
            style={{ color: styleConfig.primaryColor, cursor: "pointer" }}
          >
            Try again
          </span>
        </Text>
      </CenterContentLayout>
    );
  }

  return (
    <CenterContentLayout
      orgName={orgName}
      orgLogoURL={orgLogoURL}
      showLogo
      pageTitle="Reset Password"
    >
      <Stack gap="16px">
        <DisplayHeading>Reset your password</DisplayHeading>
        <PageDescription>
          Enter your email address and we’ll send you password reset
          instructions.
        </PageDescription>
      </Stack>
      <FieldContainer>
        <FieldLabel required>Registered Email</FieldLabel>
        <TextField
          name="email"
          id="email"
          placeholder="Input your registered email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          helperText={touched.email && errors.email}
        />
      </FieldContainer>
      <SubmitButton
        variant="contained"
        type="submit"
        onClick={formik.handleSubmit}
        disabled={
          !formik.isValid ||
          (isReCaptchaSetup && !isScriptLoaded) ||
          resetPasswordMutation.isLoading
        }
        loading={resetPasswordMutation.isLoading}
      >
        Submit
      </SubmitButton>
      {isReCaptchaSetup && (
        <ReCAPTCHA
          size="invisible"
          sitekey={googleReCaptchaSiteKey}
          ref={reCaptchaRef}
          asyncScriptOnLoad={() => {
            setIsScriptLoaded(true);
          }}
          onErrored={() => {
            setHasCaptchaErrored(true);
          }}
        />
      )}
    </CenterContentLayout>
  );
};

export default ResetPasswordPage;
