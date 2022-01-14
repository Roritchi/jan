'use strict'

const express = require('express')
const { query, body, validationResult } = require( 'express-validator' )
const { v4: uuidv4 } = require( 'uuid' )

const router = express.Router()

/**
 * @swagger
 * /shopping/{listId}:
 *   get:
 *     summary: Returns all list items
 *     parameters:
 *       - in: path
 *         name: listId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of List
 *     responses:
 *       200:
 *         description: successfully got all shopping items from listid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ResponseId:
 *                   type: string
 *                 ResponseDateTime:
 *                   type: integer
 *                 Result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       owner:
 *                         type: string
 *                         format: uuid
 *                       family:
 *                         type: string
 *                         format: uuid
 *                       shoppinglist:
 *                         type: string
 *                         format: uuid
 *                 Message:
 *                   type: string
 */
router.get('/:list', (req, res, next) => {
    req.mysql.query('SELECT * FROM listitem WHERE shoppinglist = ?', [req.params.list])
        .then(([rows]) => res.json({ ResponseId: uuidv4(), ResponseDateTime: Date.now(), Result: rows, Message: "Success" }))
        .catch(next)
})

router.post('/:list', (req, res, next) => {
    const id = uuidv4()
    req.mysql.execute('INSERT INTO listitem (id, owner, family, shoppinglist) values (?, ?, ?, ?)', [id, req.body.owner, req.body.family, req.params.list])
        .then(() => res.json({
            ResponseId: id,
            ResponseDateTime: Date.now(),
            Result: true,
            Message: "Success"
        }))
        .catch(next)
})

module.exports = router