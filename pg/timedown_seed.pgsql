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
    "weeklyBlackOuts" jsonb DEFAULT 'null'::jsonb,
    "miscBlackOuts" jsonb DEFAULT 'null'::jsonb,
    "eventBuffer" jsonb DEFAULT 'null'::jsonb
);


ALTER TABLE public.settings OWNER TO tpl5_2021h1;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: tpl5_2021h1
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    "userId" integer,
    "dueDate" timestamp with time zone,
    "estTime" jsonb,
    summary text,
    description text,
    created timestamp without time zone DEFAULT '2021-05-05 19:52:37.442996'::timestamp without time zone
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
-- Data for Name: checkins; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.checkins (id) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.settings ("userId", "pushNotifications", "emailNotifications", "addToGoogleCal", "awakeTime", "weeklyBlackOuts", "miscBlackOuts", "eventBuffer") FROM stdin;
2	f	f	f	{"end": {"hours": 21, "minutes": 0}, "start": {"hours": 9, "minutes": 0}, "timeZone": "GMT-0700"}	{"fri": [{"end": null, "start": null, "timeZone": null}], "mon": [{"end": null, "start": null, "timeZone": null}], "sat": [{"end": null, "start": null, "timeZone": null}], "sun": [{"end": null, "start": null, "timeZone": null}], "thu": [{"end": null, "start": null, "timeZone": null}], "tue": [{"end": null, "start": null, "timeZone": null}], "wed": [{"end": null, "start": null, "timeZone": null}]}	[{"end": null, "start": null, "timeZone": null}]	{"hours": null, "minutes": 15}
1	f	f	f	{"end": {"hours": 22, "minutes": 0}, "start": {"hours": 8, "minutes": 30}, "timeZone": "GMT-0700"}	{"fri": [{"end": null, "start": null, "timeZone": null}], "mon": [{"end": null, "start": null, "timeZone": null}], "sat": [{"end": null, "start": null, "timeZone": null}], "sun": [{"end": null, "start": null, "timeZone": null}], "thu": [{"end": null, "start": null, "timeZone": null}], "tue": [{"end": null, "start": null, "timeZone": null}], "wed": [{"end": null, "start": null, "timeZone": null}]}	[{"end": null, "start": null, "timeZone": null}]	{"hours": 0, "minutes": 15}
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.tasks (id, "userId", "dueDate", "estTime", summary, description, created) FROM stdin;
2	1	2021-05-30 00:00:00-07	{"hours": 40}	Oxygen Hero Illustrations	You must create five illustrations for the product packaging that show the company's team. They would prefer a more abstract art style, and would like you to use the brand color, which is grey. Take into account the client's preferences and values.	2021-05-05 19:52:37.442996
1	1	2021-06-06 00:00:00-07	{"hours": 60}	Oxynello Package Design	You must create packaging for the company's main product. They want you to use interesting materials, and make sure you include a description of the product. They would prefer a extravagant design, and would like you to use the brand color, which is black. Take into account the client's preferences and values.	2021-05-05 19:52:37.442996
5	1	2021-05-21 00:00:00-07	{"hours": 15, "minutes": 30}	Bronze Capella	We make textbooks for learning writing. We stand out because of our new technologies. Our target audience is kids. We want to convey a sense of importance, while at the same time being kind. You must create two illustrations for the company website that convey the company's values. They would prefer a traditional art style, and would like you to use the brand color, which is green. Take into account the client's preferences and values.	2021-05-05 19:52:37.442996
6	1	2021-05-28 00:00:00-07	{"hours": 20}	Essay: The Impact of Entertainment	Write an 8,000-word essay from the prompt "The Impact of Entertainment." For English class.	2021-05-05 19:52:37.442996
7	2	2021-05-21 00:00:00-07	{"hours": 40}	Finish App	Finish Timedown app in time to present.	2021-05-05 19:52:37.442996
\.


--
-- Data for Name: timeblocks; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.timeblocks (id, "taskId", "userId", start, "end") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tpl5_2021h1
--

COPY public.users (id, username, email) FROM stdin;
1	sunsaplenty	sunny.codetester@gmail.com
2	brieanburrito	brienna.klassen@gmail.com
\.


--
-- Name: checkins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.checkins_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl5_2021h1
--

SELECT pg_catalog.setval('public.tasks_id_seq', 8, true);


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
-- Name: settings userId; Type: FK CONSTRAINT; Schema: public; Owner: tpl5_2021h1
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

