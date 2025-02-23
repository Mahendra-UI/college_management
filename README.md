# college_management
collegemanagement


<!-- SELECT setval('login_user_id_seq', COALESCE((SELECT MAX(user_id) FROM login), 1), false); -->

<!-- SELECT setval('students_student_id_seq', 1, false);
SELECT setval('login_user_id_seq', 1, false); -->


<!-- -- ✅ Reset `user_id` sequence in login table
SELECT setval('login_user_id_seq', COALESCE((SELECT MAX(user_id) FROM login), 1), false); -->


<!-- -- ✅ Reset student_id sequence to start from 1
SELECT setval('students_student_id_seq', COALESCE((SELECT MAX(student_id) FROM students), 1), false); -->



<!-- Run the following SQL command to fix the auto-increment issue in PostgreSQL: -->

<!-- SELECT setval('login_user_id_seq', COALESCE((SELECT MAX(user_id) FROM login), 1), false); -->

<!-- 
Explanation:
setval() resets the sequence used for auto-increment.
COALESCE((SELECT MAX(user_id) FROM login), 1) ensures it starts from the highest existing ID or 1 if no records exist.
When to Use This?
✅ Use this after deleting records or if the issue persists even after restarting the database. -->


<!-- TRUNCATE TABLE students RESTART IDENTITY CASCADE; -->

<!-- DROP FUNCTION IF EXISTS public.insert_student CASCADE; -->


<!-- ALTER TABLE students ADD COLUMN father_name VARCHAR(255);

ALTER TABLE students DROP COLUMN student_semester_cgpa, DROP COLUMN student_pass_status; -->

<!-- 

SELECT last_value FROM students_student_id_seq;


ALTER SEQUENCE students_student_id_seq RESTART WITH 1;


UPDATE students SET student_id = DEFAULT WHERE student_id = 2;


ALTER TABLE students ALTER COLUMN student_id SET DEFAULT nextval('students_student_id_seq'); -->




<!-- 
select * from login l 

CREATE EXTENSION IF NOT EXISTS pgcrypto;



DROP EXTENSION IF EXISTS pgcrypto CASCADE;



UPDATE login SET password = crypt('Student123', gen_salt('bf')) WHERE username = 'B224002';


SELECT username, passwor	d FROM login WHERE username = 'B224002';

SELECT password = crypt('Mahendra123', password) AS is_match
FROM login WHERE username = 'B224002';


SELECT crypt('Mahendra123', password) = password AS is_match
FROM login 
WHERE username = 'B224002';

UPDATE login 
SET password = crypt('Mahendra123', gen_salt('bf')) 
WHERE username = 'B224002';

UPDATE login 
SET password = crypt('Student123', gen_salt('bf')) 
WHERE username = 'B224001'; -->






<!-- 
SELECT conname, condeferrable, convalidated, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'students'::regclass AND contype = 'c';


ALTER TABLE students DROP CONSTRAINT students_student_status_check;


ALTER TABLE students ADD CONSTRAINT students_student_status_check
CHECK (student_status IN ('Active', 'Inactive', 'Completed'));


SELECT username, full_name, academic_course_year_id, student_status 
FROM students 
WHERE username = 'B522001';
 -->
