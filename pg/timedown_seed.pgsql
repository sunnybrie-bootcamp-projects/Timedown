--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: checkins; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.checkins (
    id integer NOT NULL,
    "taskId" integer,
    start timestamp with time zone DEFAULT now(),
    "end" timestamp with time zone DEFAULT now(),
    "dateRecorded" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.checkins OWNER TO tpl5_2021h1;

--
-- Name: checkins_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl5_2021h1
--

CREATE SEQUENCE public.checkins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.checkins_id_seq OWNER TO tpl5_2021h1;

--
-- Name: checkins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl5_2021h1
--

ALTER SEQUENCE public.checkins_id_seq OWNED BY public.checkins.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.settings (
    "userId" integer NOT NULL,
    "pushNotifications" boolean DEFAULT false,
    "emailNotifications" boolean DEFAULT false,
    "addToGoogleCal" boolean DEFAULT false,
    "awakeTime" jsonb DEFAULT '{"end": "00:00", "start": "00:00"}'::jsonb,
    "weeklyBlackOuts" jsonb DEFAULT '{"fri": [], "mon": [], "sat": [], "sun": [], "thu": [], "tue": [], "wed": []}'::jsonb,
    "miscBlackOuts" jsonb DEFAULT '[]'::jsonb,
    "eventBuffer" jsonb DEFAULT '{"hours": 0, "minutes": 0}'::jsonb
);


ALTER TABLE public.settings OWNER TO tpl5_2021h1;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "dueDate" timestamp with time zone,
    "estTime" jsonb,
    summary text,
    description text,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tasks OWNER TO tpl5_2021h1;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl5_2021h1
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO tpl5_2021h1;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl5_2021h1
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: timeblocks; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.timeblocks (
    id integer NOT NULL,
    "taskId" integer,
    "userId" integer,
    start timestamp with time zone,
    "end" timestamp with time zone
);


ALTER TABLE public.timeblocks OWNER TO tpl5_2021h1;

--
-- Name: timeblocks_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl5_2021h1
--

CREATE SEQUENCE public.timeblocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.timeblocks_id_seq OWNER TO tpl5_2021h1;

--
-- Name: timeblocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl5_2021h1
--

ALTER SEQUENCE public.timeblocks_id_seq OWNED BY public.timeblocks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text,
    email text
);


ALTER TABLE public.users OWNER TO tpl5_2021h1;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl5_2021h1
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO tpl5_2021h1;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl5_2021h1
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: checkins id; Type: DEFAULT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.checkins ALTER COLUMN id SET DEFAULT nextval('public.checkins_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: timeblocks id; Type: DEFAULT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks ALTER COLUMN id SET DEFAULT nextval('public.timeblocks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: checkins checkins_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY ("userId");


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: timeblocks timeblocks_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks
    ADD CONSTRAINT timeblocks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: checkins checkins_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT "checkins_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: settings settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasks tasks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timeblocks timeblocks_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks
    ADD CONSTRAINT "timeblocks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timeblocks timeblocks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks
    ADD CONSTRAINT "timeblocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

