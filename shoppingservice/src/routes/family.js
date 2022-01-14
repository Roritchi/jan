'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

router.get('/:family/members', (req, res, next) => {
    req.mysql.query('SELECT * FROM familymembers WHERE family = ?', [req.params.family])
        .then(([rows]) => res.json({
            ResponseId: uuidv4(),
            ResponseDateTime: Date.now(),
            Result: rows.map(_ => _.member),
            Message: "Success"
        }))
        .catch(next)
})

router.post('/:family/:member', (req, res, next) => {
    req.mysql.execute('INSERT INTO familymembers (family, member) values (?, ?)', [req.params.family, req.params.member])
        .then(() => res.json({
            ResponseId: uuidv4(),
            ResponseDateTime: Date.now(),
            Result: true,
            Message: "Success"
        }))
        .catch(next)
})

router.get('/:family', (req, res, next) => {
    req.mysql.query('SELECT * FROM shoppinglist WHERE family = ?', [req.params.family])
        .then(([rows]) => res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: { progress: rows.map(_ => _.status).reduce((prev, cur, i, arr) => prev + cur, 0) / rows.length * 2,
            items: rows }, Message: "Success" }))
        .catch(next)
})

router.post('/:family', (req, res, next) => {
    const id = uuidv4()
    req.mysql.execute('INSERT INTO shoppinglist (id, family, owner, thumbnail, title) values (?, ?, ?, ?, ?)', [id, req.params.family, req.body.owner, req.body.thumbnail, req.body.title])
        .then(() => res.json({
            ResponseId: id,
            ResponseDateTime: Date.now(),
            Result: true,
            Message: "Success"
        }))
        .catch(next)
})

router.get('/', (req, res, next) => {
    req.mysql.query('SELECT * FROM family')
        .then(([rows]) => res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: "Success" }))
        .catch(next)
})

router.post('/', (req, res, next) => {
    const id = uuidv4()
    req.mysql.execute('INSERT INTO family (id, title, image) values (?, ?, ?)', [id, req.body.title, req.body.image])
        .then(() => res.json({
            ResponseId: id,
            ResponseDateTime: Date.now(),
            Result: true,
            Message: "Success"
        }))
        .catch(next)
})

module.exports = router

 