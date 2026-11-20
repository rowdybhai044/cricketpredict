export interface SendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: {
    id: number;
    mobile: string;
    name: string;
    date_of_birth: string;
    role: string;
    wallet_balance: string;
    date_joined: string;
  }
}



export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: number;
  roleName: string;
  schoolId: string;
  isActive: boolean;
}

export interface SchoolConfiguration {
  estimatedStudents: number;
  estimatedBill: number;
  video: string;
}

export interface ParentSchool {
  id: string;
  name: string;
}

export interface Branches {
  id: string;
  name: string;
}

export interface SchoolData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl: string;
  website: string;
  description: string;
  isApproved: true,
  isActive: true,
  parentSchoolId: string,
  createdAt: string,
  updatedAt: string;
  schoolConfigurations: SchoolConfiguration;
  parentSchool: ParentSchool;
  branches: Branches;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    user: UserData;
    school: SchoolData;
    token: string;
  }
  statusCode: number;
}

// User Response
export interface UserStudentClassData {
  id: string;
  name: string;
  schoolId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStudentData {
  id: string;
  userId: string;
  gender: string | null;
  profilePicture: string | null;
  rollNumber: string;
  admissionNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  primaryContact: string;
  secondaryContact: string;
  address: string;
  nationality: string;
  moles: string[];
  motherTongue: string;
  schoolId: string;
  classId: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  class: UserStudentClassData;
}

export interface UserTeacherData {
  id: string;
  userId: string;
  schoolId: string;
  isClassTeacher: boolean;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    isActive: boolean;
    roleId: string;
    roleName: string;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
    student: UserStudentData | null;
    teacher: UserTeacherData | null;
  }[];
  statusCode: number;
}

export interface CreateUserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    roleName: string;
    schoolId: string;
    isActive: boolean;
    roleId: string;
    updatedAt: string;
    createdAt: string;
  };
  statusCode: number;
}

export interface UpdateUserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    isActive: boolean;
    password: string;
    roleId: string;
    roleName: string;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
  };
  statusCode: number;
}

export interface UserSchoolData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl: string;
  website: string;
  description: string;
  isApproved: boolean;
  isActive: boolean;
  parentSchoolId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserLeaveData {
  id: string;
  userId: string;
  schoolId: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttendanceRecordsData {
  id: string;
  userId: string;
  academicYearId: string;
  date: string;        // ISO date string
  period: number;
  isPresent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    isActive: boolean;
    roleId: string;
    roleName: string;
    schoolId: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    role: {
      id: string;
      name: string;
    };
    school: UserSchoolData;
    leaves: UserLeaveData[];
    attendanceRecords: UserAttendanceRecordsData[];
    student: Omit<UserStudentData, 'class'> | null; // ✅ removes class property
    teacher: UserTeacherData | null;
  };
  statusCode: number;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
  statusCode: number;
}

// Classes Response
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  isActive: boolean;
  password: string;
  roleId: string;
  roleName: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  isClassTeacher: boolean;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface SchoolClass {
  id: string;
  name: string;
  schoolId: string;
  teacherId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  teacher: Teacher;
}

export interface GetAllClassesResponse {
  success: boolean;
  data: {
    classes: SchoolClass[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
  statusCode: number;
}