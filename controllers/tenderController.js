const model = require('../models/tenderModel');
const dayjs = require('dayjs');
const { numberWithSpaces } = require("../helpers/formatter");

exports.homePage = (req, res) => {
    res.render('index');
};

exports.listActiveTenders = async (req, res) => {
    try {
        const tenders = await model.getAllActiveTenders();
        res.render('tenders', { tenders });
    } catch (error) {
        res.status(500).send('Error while fetching active tenders');
    }
};

exports.listEndedTenders = async (req, res) => {
    try {
        const endedTenders = await model.getEndedTenders();
        res.render('ended_tenders', { endedTenders });
    } catch (error) {
        res.status(500).send('Error while fetching ended tenders');
    }
};

exports.tenderDetails = async (req, res) => {
    try {
        const tender = await model.getTenderById(req.params.id);
        if (!tender) return res.status(404).send('Tender not found');

        const isActive = dayjs().isBefore(dayjs(tender.end_date));
        let offers = [];
        let isWinner = false;

        if (!isActive) {
            offers = await model.getOffersByTenderId(req.params.id);
            if (offers.length > 0) {
                isWinner = Number(offers[0].offer_value) <= Number(tender.budget)
            }
        }

        res.render('tender_details', { tender, isActive, isWinner, offers, numberWithSpaces });
    } catch (error) {
        res.status(500).send(`Error while fetching tender details.`);
    }
};

exports.showOfferForm = async (req, res) => {
    try {
        const tender = await model.getTenderById(req.params.id);
        if (!tender) return res.status(404).send('Tender not found');

        const isActive = dayjs().isBefore(dayjs(tender.end_date));
        if (!isActive) return res.send('Tender has ended');

        res.render('offer_form', { tender });
    } catch (error) {
        res.status(500).send('Error while displaying offer form');
    }
};

exports.submitOffer = async (req, res) => {
    try {
        const { bidderName, offerValue } = req.body;

        const tender = await model.getTenderById(req.params.id);
        if (!tender) return res.status(404).send('Tender not found');

        const isActive = dayjs().isBefore(dayjs(tender.end_date));
        if (!isActive) return res.send('Tender has ended');

        await model.addOffer(req.params.id, bidderName, offerValue);
        res.redirect('/tenders/' + req.params.id);
    } catch (error) {
        res.status(500).send(`Error while submitting offer ${error}`);
    }
};

exports.showAddTender = (req, res) => {
    res.render('add_tender');
};

exports.createTender = async (req, res) => {
    try {
        if (!req.body.title || !req.body.institution || !req.body.description ||
            !req.body.start_date || !req.body.end_date || !req.body.budget) {
            return res.status(400).send('Data is missing');
        }

        if (req.end_date <= req.start_date) {
            return res.status(400).send('End date is invalid');
        }

        await model.createTender(req.body);
        res.redirect('/tenders');
    } catch (error) {
        res.status(500).send(`Error while creating tender`);
    }
};
