import React, { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getMessaging } from '@react-native-firebase/messaging';

import ERPButton from '../../../../components/button/ERPButton';
import ERPTextInput from '../../../../components/input/ERPTextInput';
import { useApi } from '../../../../hooks/useApi';
import useFcmToken from '../../../../hooks/useFcmToken';
import useTranslations from '../../../../hooks/useTranslations';
import {
  DevERPService,
  MOCK_PHONE_LOGIN_ENABLED,
  MOCK_PHONE_OTP,
} from '../../../../services/api';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { styles } from '../login_style';
import { LoginFormProps } from '../types';

type LoginResponse = {
  [key: string]: any;
  success?: number | string;
  message?: string;
  otp?: number | string;
  app_id?: string;
};

const parseLoginResponse = (response: LoginResponse): LoginResponse => {
  if (!response?.d) {
    return response;
  }

  const parsedData =
    typeof response.d === 'string' ? JSON.parse(response.d) : response.d;

  if (!parsedData || typeof parsedData !== 'object') {
    throw new Error('Invalid login response');
  }

  return { ...response, ...parsedData };
};

const getResponseOtp = (response: LoginResponse): string | null => {
  if (response.otp === undefined || response.otp === null) {
    return null;
  }
  const otp = String(response.otp).trim();
  return otp ? otp : null;
};

const loginValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    company_code: Yup.string().required(t('company_code_required')),
    phone: Yup.string()
      .matches(/^[6-9][0-9]{9}$/, t('auth.invalidPhone'))
      .required(t('auth.phoneRequired')),
  });

const LoginWithPhone: React.FC<LoginFormProps> = ({
  isLoading,
  onLoginSuccess,
  showAlert,
}) => {
  const { t } = useTranslations();
  const { token: fcmToken } = useFcmToken();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const otpFade = useRef(new Animated.Value(0)).current;

  const {
    execute: validateCompanyCode,
    loading: validationLoading,
    error: validationError,
  } = useApi();
  const {
    execute: submitPhoneLogin,
    loading: loginLoading,
    error: loginError,
  } = useApi<LoginResponse>();

  const requestPhoneLogin = async (phoneNumber: string): Promise<LoginResponse> => {
    const currentFcmToken = fcmToken || (await getMessaging().getToken()) || '';
    const response = await submitPhoneLogin(() =>
      DevERPService.loginWithPhone({
        phonenumber: phoneNumber,
        firebaseid: currentFcmToken,
      }),
    );
    if (!response) {
      throw new Error(t('auth.loginFailed'));
    }

    const parsedResponse = parseLoginResponse(response);
    if (`${parsedResponse.success}` !== '1') {
      throw new Error(parsedResponse.message || t('auth.loginFailed'));
    }
    return parsedResponse;
  };

  const continueLogin = async (
    response: LoginResponse,
    companyCode: string,
    validation: any,
    phoneNumber: string,
  ) => {
    const authToken = response.token;
    const tokenValidTill = response.validtill || response.validTill;
    if (authToken && tokenValidTill) {
      await DevERPService.setAuthToken(String(authToken), String(tokenValidTill));
    } else {
      const fetchedToken = await DevERPService.getAuth();
      if (!fetchedToken || fetchedToken === 'token_expired') {
        throw new Error(t('auth.loginFailed'));
      }
    }
    await onLoginSuccess(
      companyCode,
      '',
      {
        user: phoneNumber,
        name: response.username || response.fullname || phoneNumber,
      },
      response,
      validation,
    );
  };

  const handleLoginSubmit = async (values: { company_code: string; phone: string }) => {
    if (isApiLoading) {
      return;
    }

    setIsApiLoading(true);
    setPhone(values.phone);
    try {
      const validation = await validateCompanyCode(() =>
        DevERPService.validateCompanyCode(values.company_code),
      );
      if (!validation?.isValid) {
        showAlert({
          title: t('test4'),
          message: validation?.message || t('auth.invalidCompanyCode'),
          type: 'error',
        });
        return;
      }

      setCompanyData(validation);
      const response = await requestPhoneLogin(values.phone);
      setLoginResponse(response);
      const responseOtp = getResponseOtp(response);
      if (responseOtp !== null) {
        setExpectedOtp(responseOtp);
        Animated.timing(otpFade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else {
        await continueLogin(response, values.company_code, validation, values.phone);
      }
    } catch (error) {
      showAlert({
        title: t('test4'),
        message: error instanceof Error ? error.message : t('auth.loginFailed'),
        type: 'error',
      });
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleVerifyOtp = async (companyCode: string) => {
    if (!loginResponse || expectedOtp === null) {
      return;
    }
    if (otp.trim() !== expectedOtp) {
      showAlert({
        title: t('test4'),
        message: t('auth.otpMismatch'),
        type: 'error',
      });
      return;
    }

    setIsApiLoading(true);
    try {
      await continueLogin(loginResponse, companyCode, companyData, phone);
    } catch (error) {
      showAlert({
        title: t('test4'),
        message: error instanceof Error ? error.message : t('auth.loginFailed'),
        type: 'error',
      });
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleResendOtp = async (companyCode: string) => {
    setIsApiLoading(true);
    try {
      const response = await requestPhoneLogin(phone);
      setLoginResponse(response);
      const responseOtp = getResponseOtp(response);
      if (responseOtp !== null) {
        setExpectedOtp(responseOtp);
        setOtp('');
      } else {
        setExpectedOtp(null);
        await continueLogin(response, companyCode, companyData, phone);
      }
    } catch (error) {
      showAlert({
        title: t('test4'),
        message: error instanceof Error ? error.message : t('auth.loginFailed'),
        type: 'error',
      });
    } finally {
      setIsApiLoading(false);
    }
  };

  const isBusy = isLoading || isApiLoading || validationLoading || loginLoading;

  return (
    <Formik
      initialValues={{ company_code: '', phone: '' }}
      validationSchema={loginValidationSchema(t)}
      onSubmit={handleLoginSubmit}
    >
      {({ handleChange, handleBlur, values, errors, touched, handleSubmit }) => (
        <>
          {(validationError || loginError) && (
            <View style={styles.errorContainer}>
              {!!validationError && <Text style={styles.errorText}>{validationError}</Text>}
              {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}
            </View>
          )}

          <ERPTextInput
            label={t('auth.companyCode')}
            placeholder={t('auth.enterCompanyCode')}
            field="company_code"
            autoCapitalize="none"
            onChangeText={handleChange('company_code')}
            onBlur={handleBlur('company_code')}
            value={values.company_code}
            error={errors.company_code}
            touched={touched.company_code}
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            inputStyle={styles.input}
            errorStyle={styles.errorText}
            editable={!expectedOtp}
          />

          {!expectedOtp ? (
            <>
              <ERPTextInput
                label={t('auth.phone')}
                placeholder={t('auth.enterPhone')}
                field="phone"
                keyboardType="number-pad"
                autoCapitalize="none"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                error={errors.phone}
                touched={touched.phone}
                containerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
                inputStyle={styles.input}
                errorStyle={styles.errorText}
                maxLength={10}
              />
              <ERPButton
                text={isBusy ? t('auth.signingIn') : t('auth.signIn')}
                isLoading={isBusy}
                isApiLoading={isBusy}
                onPress={handleSubmit as any}
                disabled={isBusy}
                color={isBusy ? '#aaa' : ERP_COLOR_CODE.ERP_COLOR}
                style={{
                  ...styles.loginButton,
                  backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                }}
                textStyle={styles.loginButtonText}
              />
            </>
          ) : (
            <Animated.View style={{ opacity: otpFade }}>
              <Text style={styles.helperText}>{t('auth.otpSent')}</Text>
              {MOCK_PHONE_LOGIN_ENABLED && (
                <Text style={styles.helperText}>
                  {t('auth.mockOtp')}: {MOCK_PHONE_OTP}
                </Text>
              )}
              <ERPTextInput
                label={t('auth.otp')}
                placeholder={t('auth.enterOtp')}
                field="otp"
                keyboardType="number-pad"
                autoCapitalize="none"
                value={otp}
                onChangeText={setOtp}
                containerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
                inputStyle={styles.input}
              />
              <ERPButton
                text={isBusy ? t('auth.signingIn') : t('auth.verifyOtp')}
                isLoading={isBusy}
                isApiLoading={isBusy}
                onPress={() => handleVerifyOtp(values.company_code)}
                disabled={isBusy}
                color={isBusy ? '#aaa' : ERP_COLOR_CODE.ERP_COLOR}
                style={{
                  ...styles.loginButton,
                  backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                }}
                textStyle={styles.loginButtonText}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => {
                    setExpectedOtp(null);
                    setLoginResponse(null);
                    setOtp('');
                    otpFade.setValue(0);
                  }}
                  disabled={isBusy}
                >
                  <Text style={styles.helperText}>{t('auth.changePhone')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleResendOtp(values.company_code)}
                  disabled={isBusy}
                >
                  <Text style={styles.helperText}>{t('auth.resendOtp')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </>
      )}
    </Formik>
  );
};

export default LoginWithPhone;
