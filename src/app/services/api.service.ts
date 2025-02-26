import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}


  login(userType: string, username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { userType, username, password });
  }

  getStudents(p_type: number = 0): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/getstudents?p_type=${p_type}`);
  }
  

  
// ✅ Get all semesters
getSemesters(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getsemesters`);
}


// ✅ Get subjects by Course ID
getSubjectsByCourse(courseId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getsubjects/${courseId}`);
}

// ✅ Add Subject
addSubject(subjectData: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/addsubject`, subjectData);
}

getSubjects(courseId: number, semesterId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/getsubjects/${courseId}/${semesterId}`);
}
/** ✅ Get Subject by ID */
getSubjectById(subjectId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getsubject/${subjectId}`);
}

// ✅ Update Subject (Pass Subject ID and Update Data)
updateSubject(subjectId: number, subjectData: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/updatesubject/${subjectId}`, subjectData);
}


getSubjectsByUsername(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getsubjects/user/${encodeURIComponent(username)}`);
}

  
  getSubjectsByCourseAndSemester(courseId: number, semesterId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getsubjects/${courseId}/${semesterId}`);
  }
    // ✅ Fetch Subjects by Username and Course ID
    getSubjectsByUsernameAndCourse(username: string, courseId: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/getsubjects/user/${username}/${courseId}`);
    }


    getStudentResultsBySemester(username: string, semesterId: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/getStudentResults/${username}/${semesterId}`);
    }
    

// ✅ Fetch all students
// getStudents(): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}/getstudents`);
// }

// ✅ Fetch student by username
getStudentByUsername(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentsbyusername/${username}`);
}

// ✅ Check for duplicate Mobile No & Email
// checkDuplicateStudent(mobile_no: string | null, email_id: string | null): Observable<any> {
//   return this.http.post(`${this.baseUrl}/checkduplicate`, { mobile_no, email_id });
// }
/**
   * ✅ Check if Mobile Number or Email ID already exists
   * @param mobileNo (optional)
   * @param emailID (optional)
   * @param studentId (optional) - To exclude the current student when updating
   */
checkDuplicateStudent(mobileNo: string | null, emailID: string | null, studentId?: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/checkduplicate`, {
    params: { 
      mobile_no: mobileNo || '', 
      email_id: emailID || '', 
      student_id: studentId ? studentId.toString() : ''
    }
  });
}




/**
   * ✅ Get Student by ID
   * @param studentId The ID of the student
   */
getStudentById(studentId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentsbyid/${studentId}`);
}

/**
 * ✅ Handle API Errors
 */
// private handleError(error: HttpErrorResponse) {
//   console.error('❌ API Error:', error);
//   return throwError(() => new Error(error.message || 'Server Error'));
// }


/**
 * Fetch all courses
 */
getCourses(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getcourses`);
}

getAcademicCourseYears() {
  return this.http.get<any>(`${this.baseUrl}/getacademiccourseyears`);
}


saveStudent(studentData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/savestudents`, studentData);
}

updateStudent(studentData: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/updatestudent`, studentData);
}

// Results


// ✅ Submit student result
submitStudentResult(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/addstudentresult`, data);
}

// ✅ Get subjects based on username & semester
getSubjectsByUsernameAndSemester(username: string, semesterId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getsubjects/user/${username}/${semesterId}`);
}


// ✅ Fetch Subjects by Username, Course, and Semester

getSubjectsByUsernameCourseSemester(username: string, courseId: number, semesterId: number): Observable<any> {
  if (!username.trim() || isNaN(courseId) || isNaN(semesterId)) {
      console.error("❌ Error: Invalid API call due to missing or invalid parameters", { username, courseId, semesterId });
      return throwError(() => new Error("Invalid API call - missing or incorrect parameters"));
  }
  
  return this.http.get(`${this.baseUrl}/getsubjects/user/${username.trim()}/${courseId}/${semesterId}`);
}


getStudentResultById(resultId: number) {
  return this.http.get<any>(`${this.baseUrl}/getstudentresult/${resultId}`);
}

getStudentMarksByUsername(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentresultbyusername/${username}`);
}

deleteStudentResult(resultId: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/deletestudentresult/${resultId}`);
}

deleteNotification(notificationId: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/deletenotification/${notificationId}`);
}


deleteSubject(subjectId: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/deletesubject/${subjectId}`);
}


/**
   * Change Student Password
   */
changePassword(username: string, currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/change-password`, {
    username,
    currentPassword,
    newPassword,
    confirmPassword
  });
}

// getSubjectsByUsernameCourseSemester(username: string, courseId: number, semesterId: number): Observable<any> {
//   return this.http.get<any>(`${this.baseUrl}/getsubjects/user/${username}/${courseId}/${semesterId}`);
// }

getStudentResults(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentresults`);
}

updateStudentResult(data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/updatestudentresult`, data);
}

getFeeTypes(): Observable<any> {
  return this.http.get(`${this.baseUrl}/fee-types`);
}
 /** ✅ Process Payment */

 processPayment(feeLedgerId: number, username: string, amount: number): Observable<any> {
  const body = {
    fee_ledger_id: feeLedgerId,
    username: username || "Unknown User", // ✅ Ensure username is a string
    amount: amount
  };
  return this.http.post<any>(`${this.baseUrl}/payments`, body);
}


 processPaymentold(feeLedgerId: number, username: string | null, amount: number): Observable<any> {
  const body = {
    fee_ledger_id: feeLedgerId,
    username: username,
    amount: amount
  };
  return this.http.post<any>(`${this.baseUrl}/payments`, body);
}

/** ✅ Fetch Payment Receipt */
getReceipt(transactionId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/receipt/${transactionId}`);
}

/** ✅ Fetch Fee Status for All Students */
getAllStudentsFeeStatus(): Observable<any> {
  return this.http.get(`${this.baseUrl}/students/fee-status`);
}


// ✅ Fetch Subjects by Username and Course ID
getFeeLedgerByUsername(username: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/fee-ledger/student/${username}`);
}
getFeeLedgers(): Observable<any> {
  return this.http.get(`${this.baseUrl}/fee-ledger`);
}

getFeeLedgerById(feeLedgerId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/fee-ledger/${feeLedgerId}`);
}



addFeeLedger(feeData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/fee-ledger`, feeData);
}

updateFeeLedger(fee_ledger_id: number, feeData: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/fee-ledger/${fee_ledger_id}`, feeData);
}

deleteFeeLedger(fee_ledger_id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/fee-ledger/${fee_ledger_id}`);
}


getStudentsByCourse(courseId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentsbycourse/${courseId}`);
}


// getSubjectsByUsernameCourseSemester(username: string, courseId: number, semesterId: number): Observable<any> {
//   return this.http.get<any>(`${this.baseUrl}/getsubjects/user/${username}/${courseId}/${semesterId}`);
// }



// Notifications API


// ✅ Get All Notifications
getNotifications(): Observable<any> {
  return this.http.get(`${this.baseUrl}/getnotifications`);
}

// ✅ Get Notification by ID
getNotificationById(notificationId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/getnotification/${notificationId}`);
}



// ✅ Add Notification
addNotification(notification: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/addnotification`, notification);
}

// ✅ Update Notification
updateNotification(notificationId: number, notification: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/updatenotification/${notificationId}`, notification);
}

// ✅ Add a new student promotion
addStudentPromotion(promotionData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/promotions`, promotionData);
}


 // ✅ Fetch all promotions
 getPromotions(): Observable<any> {
  return this.http.get(`${this.baseUrl}/getpromotions`);
}

// ✅ Fetch promotion details by ID
getPromotionById(promotionId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/promotions/${promotionId}`);
}

getStudentsByCourseAndYear(courseId: number, yearId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getstudentsbycourseandyear/${courseId}/${yearId}`);
}



getPromotionsByUsername(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/promotions/username/${username}`);
}


// ✅ Fetch Promotion History by Username
getPromotionHistory(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/promotion-history/${username}`);
}


getStudentCgpaByUsername(username: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/getcgpa/${username}`);
}

// ✅ Update CGPA for a student
updateStudentCgpa(data: { username: string, cgpa: number }): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/updatestudentcgpa`, data);
}

getAllStudentsCGPA(): Observable<any> {
  return this.http.get(`${this.baseUrl}/getallcgpa`);
}


}
