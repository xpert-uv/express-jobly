const jobs = require("../models/jobModel");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const router = new express.Router();

router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const result = await jobs.get();
        return res.json({ jobs: result.rows });
    } catch (e) {
        next(e);
    }
})

router.get('/search', ensureLoggedIn, async (req, res, next) => {
    try {
        const { title, minSalary, hasEquity } = req.query;
        const jobs = await jobs.findByFilter({ title: title, minSalary: minSalary, hasEquity: hasEquity });
        return res.json({ jobs });


    } catch (e) {
        next(e);
    }
})

router.post("/", ensureAdmin, (req, res, next) => {
    try {
        const result = await jobs.create(req.body);
        return res.status(201).json({ result });
    } catch (e) {
        next(e);
    }
})

router.patch("/:id", ensureAdmin, (req, res, next) => {
    try {
        const result = await jobs.update(req.params.id, req.body);
        return res.json({ result });
    } catch (e) {
        next(e)
    }
})

router.delete("/:id", ensureAdmin, (req, res, next) => {
    try {
        const result = await jobs.delete(req.prams.id);
        return res.json({ result });
    } catch (e) {
        next(e)
    }
})