export const FILE_SIZE = 3000000; // 3 MB
export const ACCEPT_MIME_TYPE = ['image/jpeg', 'image/png', 'application/pdf'];

export const DEFAULT_ROLES = {
  SCHOOL_ADMIN: 'ROLE_SCHOOL_ADMIN',
  PARENT: 'ROLE_PARENT'
};

export const ADMIN_DASHBOARD_LINK = [
  { title: 'Dasboard', url: '/admin-dashboard', showsData: true },
  { title: 'Manage Application', url: '/manage-application', showsData: true },
  { title: 'Manage Admission', url: '/manage-admission', showsData: false },
  { title: 'Manage Fees', url: '/manage-fees', showsData: false },
  { title: 'Manage Users', url: '/manage-users', showsData: false }
];

export const DATE_FORMAT = "DD/MM/yyyy";

export const PARENT_APPLICATION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  AT_PI_SCHEDULED: 'AT_PI_SCHEDULED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
};

// School side statuses
export const SCHOOL_APPLICATION_STATUS = {
  RECEIVED: 'RECEIVED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  AT_PI: 'AT_PI',
  UNDER_FINAL_REVIEW: 'UNDER_FINAL_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVOKED: 'REVOKED'
};

export const SUCCESS_STATUS = [
  PARENT_APPLICATION_STATUS.ACCEPTED,
  SCHOOL_APPLICATION_STATUS.RECEIVED,
  SCHOOL_APPLICATION_STATUS.SUBMITTED,
  SCHOOL_APPLICATION_STATUS.APPROVED
];

export const FAILED_STATUS = [
  PARENT_APPLICATION_STATUS.DECLINED,
  SCHOOL_APPLICATION_STATUS.REJECTED
];


export const STATE_TRANSITION = {
  [SCHOOL_APPLICATION_STATUS.UNDER_REVIEW]: [
    SCHOOL_APPLICATION_STATUS.AT_PI,
    SCHOOL_APPLICATION_STATUS.APPROVED,
    SCHOOL_APPLICATION_STATUS.REJECTED
  ],
  [SCHOOL_APPLICATION_STATUS.RECEIVED]: [],
  [SCHOOL_APPLICATION_STATUS.AT_PI]: [
    SCHOOL_APPLICATION_STATUS.UNDER_FINAL_REVIEW,
    SCHOOL_APPLICATION_STATUS.APPROVED,
    SCHOOL_APPLICATION_STATUS.REJECTED
  ],
  [SCHOOL_APPLICATION_STATUS.UNDER_FINAL_REVIEW]: [
    SCHOOL_APPLICATION_STATUS.APPROVED,
    SCHOOL_APPLICATION_STATUS.REJECTED
  ],
  [SCHOOL_APPLICATION_STATUS.APPROVED]: [
    SCHOOL_APPLICATION_STATUS.REVOKED
  ],
  [SCHOOL_APPLICATION_STATUS.REVOKED]: [],
};