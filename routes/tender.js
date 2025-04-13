const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenderController');

router.get('/', controller.homePage);

router.get('/tenders', controller.listActiveTenders);
router.get('/tenders/ended', controller.listEndedTenders);
router.get('/tenders/new', controller.showAddTender);

router.get('/tenders/:id', controller.tenderDetails);
router.post('/tenders', controller.createTender);

router.get('/tenders/:id/offer', controller.showOfferForm);
router.post('/tenders/:id/offer', controller.submitOffer);

module.exports = router;
