import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { Box, Stack, Typography, styled } from "@mui/material";
import * as Yup from "yup";
import { customerUserSignup } from "src/api/customer-user";
import MainImageLayout from "components/NonDashboardComponents/Layout/MainImageLayout";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import useSnackbar from "src/hooks/useSnackbar";
import { passwordRegex, passwordText } from "src/utils/passwordRegex";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../Signin/components/GoogleLogin";
import GithubLogin from "../Signin/components/GitHubLogin";
import { IDENTITY_PROVIDER_STATUS_TYPES } from "../Signin/constants";
import ReCAPTCHA from "react-google-recaptcha";
import SuccessBox from "src/components/SuccessBox/SuccessBox";
import { styleConfig } from "src/providerConfig";
import Button from "src/components/Button/Button";

const signupValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(passwordRegex, passwordText),
  // confirmPassword: Yup.string()
  //   .required("Re-enter your password")
  //   .oneOf([Yup.ref("password"), null], "Passwords must match"),
  legalcompanyname: Yup.string().required("Company name is required"),
});

const SignupPage = (props) => {
  const {
    orgName,
    orgLogoURL,
    googleIdentityProvider,
    githubIdentityProvider,
    saasBuilderBaseURL,
    googleReCaptchaSiteKey,
    isReCaptchaSetup,
  } = props;

  const router = useRouter();
  const { org, email, userSource } = router.query;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);

  const snackbar = useSnackbar();
  const reCaptchaRef = useRef(null);

  const signupMutation = useMutation(
    (payload) => {
      setShowSuccess(false);
      return customerUserSignup(payload);
    },
    {
      onSuccess: () => {
        /* eslint-disable-next-line no-use-before-define*/
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

    signupMutation.mutate(data);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      // confirmPassword: "",
      legalcompanyname: "",
      companydescription: "",
      // companyurl: "",
      userSource: "",
    },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validationSchema: signupValidationSchema,
  });

  useEffect(() => {
    const updatedValues = {};

    if (org) {
      updatedValues.legalcompanyname = decodeURIComponent(org);
    }
    // if (orgUrl) {
    //   updatedValues.companyurl = orgUrl;
    // }
    if (email) {
      updatedValues.email = decodeURIComponent(email);
    }
    if (userSource) {
      updatedValues.userSource = userSource;
    }

    formik.setValues((values) => ({
      ...values,
      ...updatedValues,
    }));

    if (org && email) {
      const readOnlyFields = ["legalcompanyname", "email"];

      readOnlyFields.forEach((fieldName) => {
        const field = document.querySelector(`[name=${fieldName}]`);
        if (field) {
          field.setAttribute("readonly", true);
        }
      });
    }
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [org, email, userSource]);

  const { values, touched, errors, handleChange, handleBlur } = formik;

  let googleIDPClientID = null;
  let showGoogleLoginButton = false;
  let isGoogleLoginDisabled = false;

  if (googleIdentityProvider) {
    showGoogleLoginButton = true;
    googleIDPClientID = googleIdentityProvider.clientId;

    const { status } = googleIdentityProvider;

    if (status === IDENTITY_PROVIDER_STATUS_TYPES.FAILED) {
      isGoogleLoginDisabled = true;
    }
  }

  let githubIDPClientID = null;
  let showGithubLoginButton = false;
  let isGithubLoginDisabled = false;

  if (githubIdentityProvider) {
    showGithubLoginButton = true;
    githubIDPClientID = githubIdentityProvider.clientId;
    const { status } = githubIdentityProvider;

    if (status === IDENTITY_PROVIDER_STATUS_TYPES.FAILED) {
      isGithubLoginDisabled = true;
    }
  }

  let policyAgreementText = `By creating your account, you agree to our`;
  if (showGoogleLoginButton && showGithubLoginButton) {
    policyAgreementText = `By creating your account manually or using your Google or GitHub account to sign up, you agree to our`;
  } else if (showGoogleLoginButton) {
    policyAgreementText = `By creating your account manually or using your Google account to sign up, you agree to our`;
  } else if (showGithubLoginButton) {
    policyAgreementText = `By creating your account manually or using your Github account to sign up, you agree to our`;
  }
  const invitationInfo = {};
  if (email || org) {
    if (email) {
      invitationInfo.invitedEmail = decodeURIComponent(email);
    }
    if (org) {
      invitationInfo.legalCompanyName = decodeURIComponent(org);
    }
  }

  if (showSuccess) {
    return (
      <MainImageLayout
        orgLogoURL={orgLogoURL}
        showArrow
        orgName={orgName}
        contentMaxWidth={650}
      >
        <SuccessBox
          title="Verify Your Email to Activate Your Account"
          description="Thank you for signing up! We've sent a confirmation link to your email. Please check your inbox and click the link to verify your email address and complete the activation process."
        />
      </MainImageLayout>
    );
  }

  return (
    <>
      <MainImageLayout
        orgName={orgName}
        orgLogoURL={orgLogoURL}
        pageTitle="Sign up"
        contentMaxWidth={650}
      >
        <DisplayHeading mt="24px">Get Started Today</DisplayHeading>

        <Box component="form" mt="44px" autoComplete="off">
          {/* Signup Form */}
          <FormGrid>
            <FieldContainer>
              <FieldLabel required>Name</FieldLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.name && errors.name}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Email</FieldLabel>
              <TextField
                name="email"
                id="email"
                placeholder="example@companyemail.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                disabled={email ? true : false}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.email && errors.email}
              </FieldError>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel required>Company Name</FieldLabel>
              <TextField
                id="legalcompanyname"
                name="legalcompanyname"
                placeholder="Enter your company's name"
                value={values.legalcompanyname}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={org ? true : false}
                error={touched.legalcompanyname && errors.legalcompanyname}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.legalcompanyname && errors.legalcompanyname}
              </FieldError>
            </FieldContainer>

            {/* <FieldContainer>
              <FieldLabel>Company URL</FieldLabel>
              <TextField
                id="companyurl"
                name="companyurl"
                placeholder="https://companyurl.com"
                value={values.companyurl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyurl && errors.companyurl}
                disabled={orgUrl ? true : false}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.companyurl && errors.companyurl}
              </FieldError>
            </FieldContainer> */}

            <FieldContainer>
              <FieldLabel required>Password</FieldLabel>
              <PasswordField
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.password && errors.password}
              </FieldError>
            </FieldContainer>

            {/* <FieldContainer>
              <FieldLabel required>Confirm Password</FieldLabel>
              <PasswordField
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
              />
              <FieldError sx={{ paddingLeft: "13px" }}>
                {touched.confirmPassword && errors.confirmPassword}
              </FieldError>
            </FieldContainer> */}
          </FormGrid>

          {/* Login and Google Button */}
          <Stack mt="32px" width="480px" mx="auto">
            <Button
              variant="contained"
              type="submit"
              onClick={formik.handleSubmit}
              disabled={
                !formik.isValid || (isReCaptchaSetup && !isScriptLoaded)
              }
              loading={signupMutation.isLoading}
            >
              Create Account
            </Button>
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
          </Stack>
        </Box>
        {Boolean(googleIdentityProvider || githubIdentityProvider) && (
          <>
            <Box borderTop="1px solid #F1F2F4" textAlign="center" mt="40px">
              <Box
                display="inline-block"
                paddingLeft="16px"
                paddingRight="16px"
                color="#687588"
                bgcolor="white"
                fontSize="14px"
                fontWeight="500"
                lineHeight="22px"
                sx={{ transform: "translateY(-50%)" }}
              >
                Or use one of these options
              </Box>
            </Box>
            <Stack direction="row" justifyContent="center" mt="20px" gap="16px">
              {showGoogleLoginButton && (
                <GoogleOAuthProvider
                  clientId={googleIDPClientID}
                  onScriptLoadError={() => {}}
                  onScriptLoadSuccess={() => {}}
                >
                  <GoogleLogin
                    disabled={isGoogleLoginDisabled}
                    saasBuilderBaseURL={saasBuilderBaseURL}
                    invitationInfo={invitationInfo}
                  />
                </GoogleOAuthProvider>
              )}
              {showGithubLoginButton && (
                <GithubLogin
                  githubClientID={githubIDPClientID}
                  disabled={isGithubLoginDisabled}
                  saasBuilderBaseURL={saasBuilderBaseURL}
                  invitationInfo={invitationInfo}
                />
              )}
            </Stack>
          </>
        )}

        <Typography
          mt="22px"
          fontWeight="500"
          fontSize="14px"
          lineHeight="22px"
          color="#A0AEC0"
          textAlign="center"
        >
          {policyAgreementText}{" "}
          <Link
            target="_blank"
            href="/terms-of-use"
            style={{ color: styleConfig.primaryColor }}
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            target="_blank"
            href="/privacy-policy"
            style={{ color: styleConfig.primaryColor }}
          >
            Privacy Policy
          </Link>
        </Typography>
        {/* Signup Link */}
        <Typography
          mt="20px"
          fontWeight="500"
          fontSize="14px"
          lineHeight="22px"
          color="#A0AEC0"
          textAlign="center"
        >
          Already have an account?{" "}
          <Link href="/signin" style={{ color: styleConfig.primaryColor }}>
            Login here
          </Link>
        </Typography>
      </MainImageLayout>
    </>
  );
};

export default SignupPage;

const FormGrid = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  columnGap: "22px",
  rowGap: "27px",
  "@media (max-width: 1280px)": {
    gridTemplateColumns: "1fr",
    rowGap: "22px",
  },
}));
