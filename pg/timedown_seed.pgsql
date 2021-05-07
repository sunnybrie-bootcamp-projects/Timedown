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
    id integer NOT NULL
);


ALTER TABLE public.checkins OWNER TO postgres;

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


ALTER TABLE public.checkins_id_seq OWNER TO postgres;

--
-- Name: checkins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl5_2021h1
--

ALTER SEQUENCE public.checkins_id_seq OWNED BY public.checkins.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    "userId" integer,
    "dueDate" timestamp with time zone,
    "estTime" text,
    summary text,
    description text,
    created timestamp without time zone DEFAULT '2021-05-05 19:52:37.442996'::timestamp without time zone
);


ALTER TABLE public.tasks OWNER TO postgres;

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


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

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


ALTER TABLE public.timeblocks OWNER TO postgres;

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


ALTER TABLE public.timeblocks_id_seq OWNER TO postgres;

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
    email text,
    settings text,
    "blackOuts" text
);


ALTER TABLE public.users OWNER TO postgres;

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


ALTER TABLE public.users_id_seq OWNER TO postgres;

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
-- Data for Name: checkins; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.checkins (id) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.tasks (id, "userId", "dueDate", "estTime", summary, description, created) FROM stdin;
1	1	2021-06-06 00:00:00-07	60 hours	First Draft	First draft of my book.	2021-05-05 19:52:37.442996
2	1	2021-05-30 00:00:00-07	30 hours	Brand Stylebook	description here	2021-05-05 19:52:37.442996
\.


--
-- Data for Name: timeblocks; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.timeblocks (id, "taskId", "userId", start, "end") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.users (id, username, email, settings, "blackOuts") FROM stdin;
1	sunsaplenty	sunny.codetester@gmail.com	\N	\N
2	brieanburrito	brienna.klassen@gmail.com	\N	\N
\.


--
-- Name: checkins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.checkins_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.tasks_id_seq', 2, true);


--
-- Name: timeblocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.timeblocks_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: checkins checkins_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_pkey PRIMARY KEY (id);


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
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: timeblocks taskId; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks
    ADD CONSTRAINT "taskId" FOREIGN KEY ("taskId") REFERENCES public.tasks(id);


--
-- Name: tasks userId; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: timeblocks userId; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.timeblocks
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

