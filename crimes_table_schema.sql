-- Table: public.crimes_table

-- DROP TABLE IF EXISTS public.crimes_table;

CREATE TABLE IF NOT EXISTS public.crimes_table
(
    index bigint,
    id bigint,
    dt_reported text COLLATE pg_catalog."default",
    dt_occurred timestamp without time zone,
    time_occ text COLLATE pg_catalog."default",
    dt_occurred_combined timestamp without time zone,
    area bigint,
    area_name text COLLATE pg_catalog."default",
    district_code bigint,
    part_1_2 bigint,
    crime_code bigint,
    crime_description text COLLATE pg_catalog."default",
    vict_age bigint,
    vict_sex text COLLATE pg_catalog."default",
    vict_descent text COLLATE pg_catalog."default",
    premise_code bigint,
    premise_description text COLLATE pg_catalog."default",
    status text COLLATE pg_catalog."default",
    status_desc text COLLATE pg_catalog."default",
    crm_cd_1 bigint,
    crm_cd_2 bigint,
    location text COLLATE pg_catalog."default",
    lat double precision,
    lon double precision,
    mocodes text COLLATE pg_catalog."default",
    weapon_used_cd bigint,
    weapon_desc text COLLATE pg_catalog."default",
    cross_street text COLLATE pg_catalog."default",
    crm_cd_3 bigint,
    crm_cd_4 bigint
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.crimes_table
    OWNER to postgres;
-- Index: ix_crimes_table_index

-- DROP INDEX IF EXISTS public.ix_crimes_table_index;

CREATE INDEX IF NOT EXISTS ix_crimes_table_index
    ON public.crimes_table USING btree
    (index ASC NULLS LAST)
    TABLESPACE pg_default;