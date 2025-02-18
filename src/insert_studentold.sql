-- DROP FUNCTION public.insert_student(varchar, varchar, varchar, date, varchar, varchar, varchar, varchar, int4, text, varchar);

CREATE OR REPLACE FUNCTION public.insert_student(p_full_name character varying, p_father_name character varying, p_student_gender character varying, p_student_date_of_birth date, p_mobile_no character varying, p_email_id character varying, p_course_name character varying, p_course_year character varying, p_enrollment_year integer, p_student_address text, p_student_status character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_student_id INT;
    new_roll_number VARCHAR(3);
    new_username VARCHAR;
    new_course_id INT;
    suffix INT := 0;
    username_available BOOLEAN := FALSE;
BEGIN
    -- ✅ Fetch `course_id`
    SELECT course_id INTO new_course_id FROM courses WHERE course_name = p_course_name;
    IF new_course_id IS NULL THEN
        RAISE EXCEPTION 'Course name does not exist';
    END IF;

    -- ✅ Generate Next Roll Number
    SELECT LPAD(
        CAST(COALESCE(MAX(roll_number::INTEGER), 0) + 1 AS TEXT), 
        3, '0'
    ) INTO new_roll_number
    FROM students 
    WHERE course_name = p_course_name
    AND enrollment_year = p_enrollment_year;

    IF new_roll_number IS NULL THEN
        new_roll_number := '001';
    END IF;

    -- ✅ Generate Initial Username
    new_username := 'B' || new_course_id || CAST(p_enrollment_year AS TEXT);

    -- ✅ Ensure Unique Username (Retries if exists)
    LOOP
        -- Check if username exists
        SELECT EXISTS (SELECT 1 FROM login WHERE username = new_username) INTO username_available;
        IF NOT username_available THEN
            EXIT;
        END IF;
        
        -- If exists, add a suffix
        suffix := suffix + 1;
        new_username := 'B' || new_course_id || CAST(p_enrollment_year AS TEXT) || '-' || suffix;
        
        -- Prevent infinite loop
        IF suffix > 100 THEN
            RAISE EXCEPTION 'Unable to generate a unique username';
        END IF;
    END LOOP;

    -- ✅ Insert Student Record
    INSERT INTO students (
        full_name, father_name, student_gender, student_date_of_birth, 
        mobile_no, email_id, username, roll_number, 
        course_id, course_name, course_year, 
        enrollment_year, student_address, student_status, created_at
    ) VALUES (
        p_full_name, p_father_name, p_student_gender, p_student_date_of_birth, 
        p_mobile_no, p_email_id, new_username, new_roll_number, 
        new_course_id, p_course_name, p_course_year, 
        p_enrollment_year, p_student_address, p_student_status, NOW()
    ) RETURNING student_id INTO new_student_id;

    -- ✅ Insert into `login` table, safely ignoring duplicates
    INSERT INTO login (username, password, user_type)
    VALUES (new_username, 'Student123', 'Student')
    ON CONFLICT (username) DO NOTHING;

    RETURN new_student_id;
END;
$function$
;
