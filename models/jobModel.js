"use strict";
const db = require("../db");
const {
    NotFoundError,

} = require("../expressError");


class Jobs {
    /**
     * creates the jobs(using titel,salary, equity, compnay_handle)
     * update the database
     * returns value accodingly;
     * able to create , update, read and delete the jobs
     * if something goes worng thorws errors.
     * 
     */

    /**
     * GET / jobs 
     * 
     * @returns list of jobs
     */
    static async get() {
        try {
            const result = await db.query(`Select * from jobs;`);
            const jobslist = result.rows;
            if (jobslist === 0) throw new NotFoundError("No list of jobs", 404);
            return jobslist;

        } catch (e) {
            next(e);
        }
    }

    /**
     * GET / jobs by using filters 
     * filters like title, minSalary, hasEquity
     * 
     * @param {*} filter 
     * @returns 
     */

    static async findByFilter(filter = { title, minSalary, hasEquity }) {
        try {
            const query = `Select * From jobs`;

            if (filter.title) {
                const result = await db.query(`${query} where title ilike %%${filter.title}%% ;`);
                return result.rows;
            }
            if (filter.minSalary) {
                const result = await db.query(`${query} where minSalary <${filter.minSalary};`);
                return result.rows;
            }
            if (filter.hasEquity) {
                const result = await db.query(`${query} where equity is ${filter.hasEquity} ;`);
                return result.rows;
            }
            if (filter.title && filter.minSalary) {
                const result = await db.query(`${query} where minSalary <${filter.minSalary} and title ilike %%${filter.title}%% ;`);
                return result.rows;
            }
            if (filter.title && filter.hasEquity) {
                const result = await db.query(`${query} where equity =${filter.hasEquity} and title ilike %%${filter.title}%% ;`);
                return result.rows;
            }
            if (filter.minSalary && filter.hasEquity) {
                const result = await db.query(`${query} where minSalary > ${filter.minSalary} and equity =${filter.hasEquity} ;`);
                return result.rows;
            }
        } catch (e) {
            next(e);
        }
    }

    /**
     * Create the job post, update database and return the post. 
     * @param {*} param0 
     * @returns the jobs deatils.
     */
    static async create({ title, salary, equity, company_handle }) {
        const result = await db.query(`Insert into jobs (title,salary,equity,company_handle)
        vlaues($1,$2,$3,$4) returning *` , [title, salary, equity, company_handle]);
        return result.rows[0];
    }

    /**
     * Update the exiting job post 
     * return the updated details
     * else 
     * throws error if job not found.
     * 
     */
    static async update(id, { title, salary, equity, company_handle }) {
        try {
            const result = await db.query(`Update jobs 
            set title=$1,
            salary=$2,
            equity=$3,
            company_handle=$4
            where id=$5 returning *`,
                [title, salary, equity, company_handle, id]);
            const jobslist = result.rows[0];
            if (jobslist === 0) throw new NotFoundError("No list of jobs", 404);
            return jobslist;
        } catch (e) {
            next(e);
        }

    }

    /**
     * Delete the job lists/ sing job
     * return message 
     * if not found 
     * throws error
     * 
     * 
     * */
    static async delete(id) {
        try {
            const result = await db.query(
                `Delete from jobs where id=$1 returning company_handle`, [id]
            );
            return result.rows[0];
        } catch (e) {
            next(e);
        }
    }

}