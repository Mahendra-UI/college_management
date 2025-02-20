# college_management
collegemanagement

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






