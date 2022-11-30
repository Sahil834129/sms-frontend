const RestEndPoint = {
  GET_STATE: 'v1/state',
  GET_STATE_CITIES: 'v1/city',
  GET_MEDIUM_OF_INSTRUCTIONS: 'v1/school/schoolMedium',
  GET_SCHOOL_BOARDS: 'v1/school/schoolBoard',
  GET_SCHOOL_GENDER: 'v1/school/schoolGender',
  GET_SCHOOL_FACILITIES: 'v1/school/facilities',
  GET_SCHOOL_EXTRA_CURRICULAR_ACTIVITIES: 'v1/school/extracurricularActivities',
  GET_SCHOOL_CLASSES: 'v1/school/classes',
  GET_SCHOOL_CLASSES_WITH_AGE: 'v1/school/classesWithAge',
  REGISTER: 'user/register',
  VERIFY_PHONE: 'user/verifyPhone/',
  SEND_OTP: 'user/sendOtp',
  LOGIN_WITH_OTP: 'user/loginWithOtp',
  LOGIN_WITH_PASSWORD: 'user/loginWithPassword',
  REFRESH_TOKEN: 'user/refreshToken',
  FORGOT_PASSWORD: 'user/forgetPassword',
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
  STUDENT_DOCUMENT: 'student/documents',
  STUDENT_DOCUMENT_UPLOAD: 'student/document/upload',
  APPLICATION_CHECKOUT: 'applicationCart/checkOutApplication',
  GET_APPLICATION_LIST: 'admission/application',
  GET_DISABILITIES: 'v1/school/disabilities',
  GET_PARENT_OCCUPATION: 'v1/school/parentOccupation',
  MARK_PROFILE_COMPLETE: '/student/markProfileComplete',
  GET_USER_DETAILS: '/parent/getProfile',
  UPDATE_USER: '/parent/updateUser',
  CHANGE_PASSWORD: '/parent/changePassword',
  UPDATE_PHONE: '/parent/updatePhone',
  CLASS_ADMISSION_DATA: '/admission/classAdmissionData',
  SCHOOL_ADMISSION_SUMMARY: 'admission/application/schoolAdmissionSummary',
  RESET_PASSWORD: 'user/resetPassword',
  DOWNLOAD_DOCUMENT:'/student/download/document'
}

export default RestEndPoint;
