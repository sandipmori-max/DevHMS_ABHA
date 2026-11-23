export const MOCK_PHONE_OTP = '123456';

export const mockPhoneLogin = async (phoneNumber: string) => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    d: JSON.stringify({
      userid: `mock-${phoneNumber}`,
      username: 'Mock User',
      roleid: '6',
      rolename: 'HR ADMIN',
      mobileno: phoneNumber,
      emailid: '',
      fullname: 'Mock User',
      success: '1',
      token: `mock-token-${phoneNumber}`,
      validtill: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      otp: MOCK_PHONE_OTP,
    }),
  };
};
