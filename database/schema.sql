--
-- PostgreSQL database dump
--

\restrict A53cgju8ab9vTv3vg7T8o4xc7SO0X7eE8pKPqRDCuTWsZcoZLWPRjBKfEafk9gI

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enrollment_status; Type: TYPE; Schema: public; Owner: ilassalimov
--

CREATE TYPE public.enrollment_status AS ENUM (
    'active',
    'completed',
    'dropped'
);


ALTER TYPE public.enrollment_status OWNER TO edu;

--
-- Name: lesson_content_type; Type: TYPE; Schema: public; Owner: ilassalimov
--

CREATE TYPE public.lesson_content_type AS ENUM (
    'video',
    'text',
    'practice'
);


ALTER TYPE public.lesson_content_type OWNER TO edu;

--
-- Name: proctoring_session_status; Type: TYPE; Schema: public; Owner: ilassalimov
--

CREATE TYPE public.proctoring_session_status AS ENUM (
    'active',
    'ended',
    'flagged'
);


ALTER TYPE public.proctoring_session_status OWNER TO edu;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: ilassalimov
--

CREATE TYPE public.user_role AS ENUM (
    'student',
    'teacher',
    'admin'
);


ALTER TYPE public.user_role OWNER TO edu;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: ilassalimov
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO edu;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: ilassalimov
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO edu;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    max_score numeric(5,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone,
    CONSTRAINT assignments_max_score_check CHECK ((max_score > (0)::numeric))
);


ALTER TABLE public.assignments OWNER TO edu;

--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignments_id_seq OWNER TO edu;

--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    issued_at timestamp with time zone DEFAULT now(),
    pdf_url text,
    verification_code character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.certificates OWNER TO edu;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certificates_id_seq OWNER TO edu;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: course_stats; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.course_stats (
    id integer NOT NULL,
    course_id integer NOT NULL,
    completion_rate numeric(5,2),
    average_score numeric(5,2),
    active_students_count integer DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT course_stats_average_score_check CHECK ((average_score >= (0)::numeric)),
    CONSTRAINT course_stats_completion_rate_check CHECK (((completion_rate >= (0)::numeric) AND (completion_rate <= (100)::numeric)))
);


ALTER TABLE public.course_stats OWNER TO edu;

--
-- Name: course_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.course_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_stats_id_seq OWNER TO edu;

--
-- Name: course_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.course_stats_id_seq OWNED BY public.course_stats.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    teacher_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    cover_url text,
    is_published boolean DEFAULT false NOT NULL,
    price numeric(10,2) DEFAULT 0,
    currency character varying(3) DEFAULT 'USD'::character varying,
    slug character varying(255) UNIQUE
);


ALTER TABLE public.courses OWNER TO edu;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO edu;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    status public.enrollment_status DEFAULT 'active'::public.enrollment_status,
    progress_percent integer DEFAULT 0,
    enrolled_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT enrollments_progress_percent_check CHECK (((progress_percent >= 0) AND (progress_percent <= 100)))
);


ALTER TABLE public.enrollments OWNER TO edu;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enrollments_id_seq OWNER TO edu;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.files (
    id bigint NOT NULL,
    course_id bigint,
    lesson_id bigint,
    submission_id bigint,
    bucket character varying(63) NOT NULL,
    object_name text NOT NULL,
    original_name text NOT NULL,
    mime_type character varying(127) NOT NULL,
    size_bytes bigint NOT NULL,
    file_type character varying(32) NOT NULL,
    public_url text,
    uploaded_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.files OWNER TO edu;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO edu;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    score numeric(5,2),
    feedback text,
    graded_by integer,
    graded_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT grades_score_check CHECK ((score >= (0)::numeric))
);


ALTER TABLE public.grades OWNER TO edu;

--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grades_id_seq OWNER TO edu;

--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.lesson_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.lesson_progress OWNER TO edu;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.lesson_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lesson_progress_id_seq OWNER TO edu;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.lesson_progress_id_seq OWNED BY public.lesson_progress.id;


--
-- Name: lesson_revisions; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.lesson_revisions (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    content_type character varying(20) NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.lesson_revisions OWNER TO edu;

--
-- Name: lesson_revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.lesson_revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lesson_revisions_id_seq OWNER TO edu;

--
-- Name: lesson_revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.lesson_revisions_id_seq OWNED BY public.lesson_revisions.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    module_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content_type public.lesson_content_type NOT NULL,
    content text,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    available_from timestamp with time zone,
    deadline timestamp with time zone
);


ALTER TABLE public.lessons OWNER TO edu;

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lessons_id_seq OWNER TO edu;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_final boolean DEFAULT false,
    completion_message text
);


ALTER TABLE public.modules OWNER TO edu;

--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modules_id_seq OWNER TO edu;

--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO edu;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO edu;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    course_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    payment_provider character varying(30) DEFAULT 'stripe'::character varying NOT NULL,
    provider_order_id text,
    provider_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO edu;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO edu;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: proctoring_events; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.proctoring_events (
    id integer NOT NULL,
    session_id integer NOT NULL,
    event_type character varying(50) NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.proctoring_events OWNER TO edu;

--
-- Name: proctoring_events_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.proctoring_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proctoring_events_id_seq OWNER TO edu;

--
-- Name: proctoring_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.proctoring_events_id_seq OWNED BY public.proctoring_events.id;


--
-- Name: proctoring_sessions; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.proctoring_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    ended_at timestamp with time zone,
    status public.proctoring_session_status DEFAULT 'active'::public.proctoring_session_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.proctoring_sessions OWNER TO edu;

--
-- Name: proctoring_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.proctoring_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.proctoring_sessions_id_seq OWNER TO edu;

--
-- Name: proctoring_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.proctoring_sessions_id_seq OWNED BY public.proctoring_sessions.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.refresh_tokens OWNER TO edu;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO edu;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer,
    teacher_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO edu;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO edu;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.student_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone_number character varying(30)
);


ALTER TABLE public.student_profiles OWNER TO edu;

--
-- Name: student_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.student_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_profiles_id_seq OWNER TO edu;

--
-- Name: student_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.student_profiles_id_seq OWNED BY public.student_profiles.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    submitted_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    google_drive_link text,
    CONSTRAINT chk_google_drive_link CHECK (((google_drive_link IS NULL) OR (google_drive_link ~ '^https://(drive|docs)\.google\.com/'::text))),
    CONSTRAINT chk_submission_has_content CHECK (((content IS NOT NULL) OR (google_drive_link IS NOT NULL)))
);


ALTER TABLE public.submissions OWNER TO edu;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_id_seq OWNER TO edu;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: teacher_profiles; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.teacher_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    bio text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.teacher_profiles OWNER TO edu;

--
-- Name: teacher_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.teacher_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teacher_profiles_id_seq OWNER TO edu;

--
-- Name: teacher_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.teacher_profiles_id_seq OWNED BY public.teacher_profiles.id;


--
-- Name: user_stats; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.user_stats (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_courses integer DEFAULT 0,
    completed_courses integer DEFAULT 0,
    average_score numeric(5,2),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_stats_average_score_check CHECK ((average_score >= (0)::numeric))
);


ALTER TABLE public.user_stats OWNER TO edu;

--
-- Name: user_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.user_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_stats_id_seq OWNER TO edu;

--
-- Name: user_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.user_stats_id_seq OWNED BY public.user_stats.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ilassalimov
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO edu;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ilassalimov
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO edu;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ilassalimov
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: course_stats id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.course_stats ALTER COLUMN id SET DEFAULT nextval('public.course_stats_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: lesson_progress id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.lesson_progress_id_seq'::regclass);


--
-- Name: lesson_revisions id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_revisions ALTER COLUMN id SET DEFAULT nextval('public.lesson_revisions_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: proctoring_events id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_events ALTER COLUMN id SET DEFAULT nextval('public.proctoring_events_id_seq'::regclass);


--
-- Name: proctoring_sessions id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_sessions ALTER COLUMN id SET DEFAULT nextval('public.proctoring_sessions_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: student_profiles id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.student_profiles ALTER COLUMN id SET DEFAULT nextval('public.student_profiles_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: teacher_profiles id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.teacher_profiles ALTER COLUMN id SET DEFAULT nextval('public.teacher_profiles_id_seq'::regclass);


--
-- Name: user_stats id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.user_stats ALTER COLUMN id SET DEFAULT nextval('public.user_stats_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: certificates certificates_verification_code_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_verification_code_key UNIQUE (verification_code);


--
-- Name: course_stats course_stats_course_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.course_stats
    ADD CONSTRAINT course_stats_course_id_key UNIQUE (course_id);


--
-- Name: course_stats course_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.course_stats
    ADD CONSTRAINT course_stats_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: grades grades_submission_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_submission_id_key UNIQUE (submission_id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: lesson_revisions lesson_revisions_lesson_id_version_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_revisions
    ADD CONSTRAINT lesson_revisions_lesson_id_version_key UNIQUE (lesson_id, version);


--
-- Name: lesson_revisions lesson_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_revisions
    ADD CONSTRAINT lesson_revisions_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_module_id_order_index_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_order_index_key UNIQUE (module_id, order_index);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_course_id_order_index_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_order_index_key UNIQUE (course_id, order_index);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: proctoring_events proctoring_events_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_events
    ADD CONSTRAINT proctoring_events_pkey PRIMARY KEY (id);


--
-- Name: proctoring_sessions proctoring_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_sessions
    ADD CONSTRAINT proctoring_sessions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_key UNIQUE (user_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (id);


--
-- Name: user_stats user_stats_user_id_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_assignments_lesson_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_assignments_lesson_id ON public.assignments USING btree (lesson_id);


--
-- Name: idx_certificates_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_certificates_course_id ON public.certificates USING btree (course_id);


--
-- Name: idx_certificates_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_certificates_user_id ON public.certificates USING btree (user_id);


--
-- Name: idx_certificates_verification_code; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_certificates_verification_code ON public.certificates USING btree (verification_code);


--
-- Name: idx_courses_is_published; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_courses_is_published ON public.courses USING btree (is_published);


--
-- Name: idx_courses_teacher_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_courses_teacher_id ON public.courses USING btree (teacher_id);


--
-- Name: idx_enrollments_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_enrollments_course_id ON public.enrollments USING btree (course_id);


--
-- Name: idx_enrollments_status; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_enrollments_status ON public.enrollments USING btree (status);


--
-- Name: idx_enrollments_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_enrollments_user_id ON public.enrollments USING btree (user_id);


--
-- Name: idx_files_course_cover; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE UNIQUE INDEX idx_files_course_cover ON public.files USING btree (course_id, file_type) WHERE ((file_type)::text = 'course_cover'::text);


--
-- Name: idx_files_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_files_course_id ON public.files USING btree (course_id);


--
-- Name: idx_files_lesson_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_files_lesson_id ON public.files USING btree (lesson_id);


--
-- Name: idx_files_submission_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_files_submission_id ON public.files USING btree (submission_id);


--
-- Name: idx_files_uploaded_by; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_files_uploaded_by ON public.files USING btree (uploaded_by);


--
-- Name: idx_grades_graded_by; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_grades_graded_by ON public.grades USING btree (graded_by);


--
-- Name: idx_grades_submission_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_grades_submission_id ON public.grades USING btree (submission_id);


--
-- Name: idx_lesson_progress_completed; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_lesson_progress_completed ON public.lesson_progress USING btree (is_completed);


--
-- Name: idx_lesson_progress_lesson_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress USING btree (lesson_id);


--
-- Name: idx_lesson_progress_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress USING btree (user_id);


--
-- Name: idx_lesson_revisions_lesson_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_lesson_revisions_lesson_id ON public.lesson_revisions USING btree (lesson_id);


--
-- Name: idx_lessons_module_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_lessons_module_id ON public.lessons USING btree (module_id);


--
-- Name: idx_modules_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_modules_course_id ON public.modules USING btree (course_id);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC);


--
-- Name: idx_notifications_is_read; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_notifications_is_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_orders_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_orders_course_id ON public.orders USING btree (course_id);


--
-- Name: idx_orders_provider_order; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_orders_provider_order ON public.orders USING btree (provider_order_id) WHERE (provider_order_id IS NOT NULL);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_user_course_paid; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE UNIQUE INDEX idx_orders_user_course_paid ON public.orders USING btree (user_id, course_id) WHERE ((status)::text = 'paid'::text);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_proctoring_events_created_at; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_proctoring_events_created_at ON public.proctoring_events USING btree (created_at);


--
-- Name: idx_proctoring_events_session_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_proctoring_events_session_id ON public.proctoring_events USING btree (session_id);


--
-- Name: idx_proctoring_sessions_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_proctoring_sessions_course_id ON public.proctoring_sessions USING btree (course_id);


--
-- Name: idx_proctoring_sessions_status; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_proctoring_sessions_status ON public.proctoring_sessions USING btree (status);


--
-- Name: idx_proctoring_sessions_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_proctoring_sessions_user_id ON public.proctoring_sessions USING btree (user_id);


--
-- Name: idx_refresh_tokens_expires_at; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_refresh_tokens_expires_at ON public.refresh_tokens USING btree (expires_at);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_reviews_course_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_reviews_course_id ON public.reviews USING btree (course_id);


--
-- Name: idx_reviews_teacher_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_reviews_teacher_id ON public.reviews USING btree (teacher_id);


--
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- Name: idx_submissions_assignment_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_submissions_assignment_id ON public.submissions USING btree (assignment_id);


--
-- Name: idx_submissions_user_id; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_submissions_user_id ON public.submissions USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: ilassalimov
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: orders orders_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: assignments trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_stats trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.course_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: enrollments trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: grades trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lesson_progress trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lessons trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: modules trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: proctoring_sessions trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.proctoring_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: student_profiles trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: submissions trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: teacher_profiles trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_stats trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users trigger_update_updated_at; Type: TRIGGER; Schema: public; Owner: ilassalimov
--

CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: assignments assignments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_stats course_stats_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.course_stats
    ADD CONSTRAINT course_stats_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: courses courses_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: files files_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: files files_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: files files_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: files files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: grades grades_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: grades grades_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lesson_revisions lesson_revisions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_revisions
    ADD CONSTRAINT lesson_revisions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: lesson_revisions lesson_revisions_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lesson_revisions
    ADD CONSTRAINT lesson_revisions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orders orders_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: proctoring_events proctoring_events_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_events
    ADD CONSTRAINT proctoring_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.proctoring_sessions(id) ON DELETE CASCADE;


--
-- Name: proctoring_sessions proctoring_sessions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_sessions
    ADD CONSTRAINT proctoring_sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: proctoring_sessions proctoring_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.proctoring_sessions
    ADD CONSTRAINT proctoring_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: student_profiles student_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teacher_profiles teacher_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_stats user_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ilassalimov
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_coauthors; Type: TABLE; Schema: public; Owner: edu
--

CREATE TABLE public.course_coauthors (
    id integer NOT NULL,
    course_id integer NOT NULL,
    teacher_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.course_coauthors OWNER TO edu;

CREATE SEQUENCE public.course_coauthors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.course_coauthors_id_seq OWNER TO edu;
ALTER SEQUENCE public.course_coauthors_id_seq OWNED BY public.course_coauthors.id;
ALTER TABLE ONLY public.course_coauthors ALTER COLUMN id SET DEFAULT nextval('public.course_coauthors_id_seq'::regclass);

ALTER TABLE ONLY public.course_coauthors
    ADD CONSTRAINT course_coauthors_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.course_coauthors
    ADD CONSTRAINT course_coauthors_course_id_teacher_id_key UNIQUE (course_id, teacher_id);

ALTER TABLE ONLY public.course_coauthors
    ADD CONSTRAINT course_coauthors_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.course_coauthors
    ADD CONSTRAINT course_coauthors_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--

\unrestrict A53cgju8ab9vTv3vg7T8o4xc7SO0X7eE8pKPqRDCuTWsZcoZLWPRjBKfEafk9gI

