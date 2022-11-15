const RestEndPoint = {
  GET_STATE: 'v1/state',
  GET_STATE_CITIES: 'v1/city',
  GET_MEDIUM_OF_INSTRUCTIONS: 'v1/school/schoolMedium',
  GET_SCHOOL_BOARDS: 'v1/school/schoolBoard',
  GET_SCHOOL_GENDER: 'v1/school/schoolGender',
  GET_SCHOOL_FACILITIES: 'v1/school/facilities',
  GET_SCHOOL_EXTRA_CURRICULAR_ACTIVITIES: 'v1/school/extracurricularActivities',
  GET_SCHOOL_CLASSES: 'v1/school/classes',
  REGISTER: 'user/register',
  VERIFY_PHONE: 'user/verifyPhone/',
  SEND_OTP: 'user/sendOtp',
  LOGIN_WITH_OTP: 'user/loginWithOtp',
  LOGIN_WITH_PASSWORD: 'user/loginWithPassword',
  REFRESH_TOKEN: 'user/refreshToken',
  FIND_SCHOOLS: '/v1/school/find',
  SCHOOL_BY_ID: '/v1/schooldetails',
  GET_CHILD_LIST: '/parent/childList',
  ADD_CHILD: '/parent/child/create',
  ADD_TO_CART: '/applicationCart/applicationList',
  APPLICATION_CART_BASE: '/applicationCart',
  GET_CART_ITEMS: '/applicationCart/child',
  GET_CITIES: '/v1/school/city',
  CREATE_STUDENT_PROFILE: 'student/profile',
  GET_STUDENT_PROFILE: 'student/profile',
  GET_STUDENT_PARENT: 'parent/guardian',
  GET_STUDENT_MEDICAL_DETAILS: 'student/medicalDetail',
  CREATE_STUDENT_MEDICAL_DETAILS: 'student/medicalDetail',
  CREATE_STUDENT_PROFILE_EXTRA_CURRICULARS: 'student/profile/extracurriculars',
  CREATE_STUDENT_PROFILE_BACKGROUND_CHECK: 'student/profile/backgroundCheck',
  STUDENT_DOCUMENT: 'student/documents'
}

export default RestEndPoint
