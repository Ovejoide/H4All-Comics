--
-- PostgreSQL database dump
--

\restrict VtfY7hkPmJccpAARRKjHCNUDarjlJmwdrgp5P47cQEenvUhA1u6noaYEfeUVJNa

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: comics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comics (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    portada_url text NOT NULL,
    sinopsis text,
    escritor character varying(255),
    anio integer,
    genero character varying(255),
    idioma character varying(10) DEFAULT 'N/A'::character varying,
    autor_url text,
    traductor text,
    tags text,
    dibujante text,
    series text
);


ALTER TABLE public.comics OWNER TO postgres;

--
-- Name: comics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comics_id_seq OWNER TO postgres;

--
-- Name: comics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comics_id_seq OWNED BY public.comics.id;


--
-- Name: paginas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paginas (
    id integer NOT NULL,
    comic_id integer,
    numero_pagina integer NOT NULL,
    imagen_url text NOT NULL
);


ALTER TABLE public.paginas OWNER TO postgres;

--
-- Name: paginas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paginas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paginas_id_seq OWNER TO postgres;

--
-- Name: paginas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paginas_id_seq OWNED BY public.paginas.id;


--
-- Name: comics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comics ALTER COLUMN id SET DEFAULT nextval('public.comics_id_seq'::regclass);


--
-- Name: paginas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paginas ALTER COLUMN id SET DEFAULT nextval('public.paginas_id_seq'::regclass);


--
-- Data for Name: comics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comics (id, titulo, portada_url, sinopsis, escritor, anio, genero, idioma, autor_url, traductor, tags, dibujante, series) FROM stdin;
8	For the Mission	https://ik.imagekit.io/rcbeujyg1/For%20the%20Mission/for-the-mission-000.jpg?updatedAt=1779849563091	Sin descripción disponible.	Desconocido	\N	Varios	N/A	\N	\N	\N	\N	\N
1	Midna's invitation	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-000.jpg?updatedAt=1779781778117	Sin descripción disponible.	Desconocido	\N	Varios	N/A	\N	\N	\N	\N	\N
2	Priyanka's got the magic touch	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/000.jpg?updatedAt=1779741402891	At Dr. Maheswaran’s office, a patient arrives with high blood pressure and an unusually high libido, which the doctor is forced to treat in an “unconventional” way for the patient’s own good.	Incogneato	2026	NSFW Comic	en	https://x.com/incogneato_art	\N	+18, Porn, NSFW, Steven Universe, Priyanka Maheswaran, Dr. Maheswaran	Incogneato	Incogneato Comics
3	Spyro x Elora - Fauning Over You	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_00.png	Sin descripción disponible.	Cobatsart	2025	NSFW Comic	en	https://x.com/Cobatsart	\N	+18, Porn, NSFW, Spyro, Elora	Cobatsart	Spyro x Elora - Fauning Over You
4	Ilulu DNA	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-000.png?updatedAt=1779767567935	Sin descripción disponible.	GeulimYKUN	2026	NSFW Comic	en	https://x.com/ykun6974	\N	+18, Porn, NSFW, Kobayashi-san Chi No Maid Dragon, Ilulu	GeulimYKUN	GeulimYKUN Comics
5	Miku Brazil	https://ik.imagekit.io/rcbeujyg1/Miku%20In%20Brazil/miku-in-brazil-000.jpg?updatedAt=1779785195200	Sin descripción disponible.	Desconocido	\N	Varios	N/A	\N	\N	\N	\N	\N
6	Argentinian & Brazilian Miku’s Fun Weekend	https://ik.imagekit.io/rcbeujyg1/Argentinian%20&%20Brazilian%20Miku_s%20Fun%20Weekend/argentinian-brazilian-miku-s-fun-weekend-000.jpg?updatedAt=1779785694530	Sin descripción disponible.	Desconocido	\N	Varios	N/A	\N	\N	\N	\N	\N
7	Clases Particulares para la Señora Forger	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/0_shinhyunxi_0_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751563	Sin descripción disponible.	Sh1N	2026	NSFW Comics	es	https://x.com/shinhyunxi	CodeArc	+18, Porn, NSFW, Spy Family, Yor Forger, Milf, Big Tits, Big Ass	Sh1N	Sh1N Comics
\.


--
-- Data for Name: paginas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paginas (id, comic_id, numero_pagina, imagen_url) FROM stdin;
1	1	1	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-001.jpg?updatedAt=1779781788204
2	1	2	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-002.jpg?updatedAt=1779781803515
3	1	3	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-003.jpg?updatedAt=1779781816935
4	1	4	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-004.jpg?updatedAt=1779781816904
5	1	5	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-005.jpg?updatedAt=1779781816777
6	1	6	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-006.jpg?updatedAt=1779781816952
7	1	7	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-007.jpg?updatedAt=1779781717022
8	1	8	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-008.jpg?updatedAt=1779781816879
9	1	9	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-009.jpg?updatedAt=1779781816915
10	1	10	https://ik.imagekit.io/rcbeujyg1/Midna_s%20invitation/midna-s-invitation-speechless-included-010.jpg?updatedAt=1779781817197
11	2	1	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/001.jpg?updatedAt=1779741402813
12	2	2	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/002.jpg?updatedAt=1779741403077
13	2	3	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/003.jpg?updatedAt=1779741402918
14	2	4	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/004.jpg?updatedAt=1779741402533
15	2	5	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/005.jpg?updatedAt=1779741402949
16	2	6	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/006.jpg?updatedAt=1779741402980
17	2	7	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/007.jpg?updatedAt=1779741402737
18	2	8	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/008.jpg?updatedAt=1779741402703
19	2	9	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/009.jpg?updatedAt=1779741402667
20	2	10	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/010.jpg?updatedAt=1779741402727
21	2	11	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/011.jpg?updatedAt=1779741402756
22	2	12	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/012.jpg?updatedAt=1779741402827
23	2	13	https://ik.imagekit.io/rcbeujyg1/Priyanka's%20got%20the%20magic%20touch/013.jpg?updatedAt=1779741402855
24	3	1	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_01.jpg?updatedAt=1779742978471
25	3	2	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_02.jpg?updatedAt=1779742978397
26	3	3	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_03.jpg?updatedAt=1779742978531
27	3	4	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_04.jpg?updatedAt=1779742978569
28	3	5	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_05.jpg?updatedAt=1779742978811
29	3	6	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_06.jpg?updatedAt=1779742978601
30	3	7	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_07.jpg?updatedAt=1779742978764
31	3	8	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_08.jpg?updatedAt=1779742978801
32	3	9	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_09.jpg?updatedAt=1779742979092
33	3	10	https://ik.imagekit.io/rcbeujyg1/Spyro%20x%20Elora%20-%20Fauning%20Over%20You/SpyroXElora_10.jpg?updatedAt=1779742978939
34	4	1	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-001.jpg?updatedAt=1779766306047
35	4	2	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-002.jpg?updatedAt=1779766305626
36	4	3	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-003.jpg?updatedAt=1779766306317
37	4	4	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-004.jpg?updatedAt=1779766306414
38	4	5	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-005.jpg?updatedAt=1779766306450
39	4	6	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-006.jpg?updatedAt=1779766306783
40	4	7	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-007.jpg?updatedAt=1779766306189
41	4	8	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-008.jpg?updatedAt=1779766306137
42	4	9	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-009.jpg?updatedAt=1779766306374
43	4	10	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-010.jpg?updatedAt=1779766305754
44	4	11	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-011.jpg?updatedAt=1779766306261
45	4	12	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-012.jpg?updatedAt=1779766306438
46	4	13	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-013.jpg?updatedAt=1779766306477
47	4	14	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-014.jpg?updatedAt=1779766305813
48	4	15	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-015.jpg?updatedAt=1779766305657
49	4	16	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-016.jpg?updatedAt=1779766305725
50	4	17	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-017.jpg?updatedAt=1779766306215
51	4	18	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-018.jpg?updatedAt=1779766306101
52	4	19	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-019.jpg?updatedAt=1779766305840
53	4	20	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-020.jpg?updatedAt=1779766306098
54	4	21	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-021.jpg?updatedAt=1779766306088
55	4	22	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-022.jpg?updatedAt=1779766306100
56	4	23	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-023.jpg?updatedAt=1779766306259
57	4	24	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-024.jpg?updatedAt=1779766306126
58	4	25	https://ik.imagekit.io/rcbeujyg1/Ilulu%20DNA/ilulu-dna-merge-025.jpg?updatedAt=1779766306102
59	5	1	https://ik.imagekit.io/rcbeujyg1/Miku%20In%20Brazil/miku-in-brazil-001.jpg?updatedAt=1779785195138
60	5	2	https://ik.imagekit.io/rcbeujyg1/Miku%20In%20Brazil/miku-in-brazil-002.jpg?updatedAt=1779785195133
61	5	3	https://ik.imagekit.io/rcbeujyg1/Miku%20In%20Brazil/miku-in-brazil-003.jpg?updatedAt=1779785312290
62	6	1	https://ik.imagekit.io/rcbeujyg1/Argentinian%20&%20Brazilian%20Miku_s%20Fun%20Weekend/argentinian-brazilian-miku-s-fun-weekend-001.jpg?updatedAt=1779785694572
63	6	2	https://ik.imagekit.io/rcbeujyg1/Argentinian%20&%20Brazilian%20Miku_s%20Fun%20Weekend/argentinian-brazilian-miku-s-fun-weekend-002.jpg?updatedAt=1779785694585
64	6	3	https://ik.imagekit.io/rcbeujyg1/Argentinian%20&%20Brazilian%20Miku_s%20Fun%20Weekend/argentinian-brazilian-miku-s-fun-weekend-003.jpg?updatedAt=1779785694657
65	6	4	https://ik.imagekit.io/rcbeujyg1/Argentinian%20&%20Brazilian%20Miku_s%20Fun%20Weekend/argentinian-brazilian-miku-s-fun-weekend-004.jpg?updatedAt=1779785694731
66	7	1	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/1_shinhyunxi_1_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751589
67	7	2	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/2_shinhyunxi_2_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751608
68	7	3	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/3_shinhyunxi_3_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751529
69	7	4	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/4_shinhyunxi_4_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751500
70	7	5	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/5_shinhyunxi_5_Clases_Particulares_para_la_Seora_Forger.webp?updatedAt=1779835751632
71	7	6	https://ik.imagekit.io/rcbeujyg1/Clases%20Particulares/6_Creditos_sexosos.webp?updatedAt=1779835751642
72	8	1	https://ik.imagekit.io/rcbeujyg1/For%20the%20Mission/for-the-mission-001.jpg?updatedAt=1779849562996
73	8	2	https://ik.imagekit.io/rcbeujyg1/For%20the%20Mission/for-the-mission-002.jpg?updatedAt=1779849563352
74	8	3	https://ik.imagekit.io/rcbeujyg1/For%20the%20Mission/for-the-mission-003.jpg?updatedAt=1779849563020
\.


--
-- Name: comics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comics_id_seq', 8, true);


--
-- Name: paginas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paginas_id_seq', 74, true);


--
-- Name: comics comics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comics
    ADD CONSTRAINT comics_pkey PRIMARY KEY (id);


--
-- Name: paginas paginas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paginas
    ADD CONSTRAINT paginas_pkey PRIMARY KEY (id);


--
-- Name: paginas paginas_comic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paginas
    ADD CONSTRAINT paginas_comic_id_fkey FOREIGN KEY (comic_id) REFERENCES public.comics(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict VtfY7hkPmJccpAARRKjHCNUDarjlJmwdrgp5P47cQEenvUhA1u6noaYEfeUVJNa

