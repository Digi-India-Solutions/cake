const express = require('express');
const { createRefCompany, getAllRefCompanies, getSingleRefCompany, updateRefCompany, deleteRefCompany } = require('../Controller/referenceCompanyController');


const RefrenceRouter = express.Router();

RefrenceRouter.post('/create-ref-company', createRefCompany);
RefrenceRouter.get('/all-ref-companies', getAllRefCompanies);
RefrenceRouter.get('/ref-company/:id', getSingleRefCompany);
RefrenceRouter.put('/update-ref-company/:id', updateRefCompany);
RefrenceRouter.delete('/delete-ref-company/:id', deleteRefCompany);

module.exports = RefrenceRouter;
