const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
/**
 * @swagger
 * /api/songs:
 *   post:
 *     summary: Create a new song
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *                 example: Shape of You
 *               duration:
 *                 type: number
 *                 example: 210
 *               artist:
 *                 type: string
 *                 example: 64fabc1234567890abcd1234
 *     responses:
 *       201:
 *         description: Song created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", songController.createSong);
/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     responses:
 *       200:
 *         description: Successfully retrieved songs
 *       500:
 *         description: Server error
 */
router.get("/", songController.getAllSongs);
router.get("/:id", songController.getSongById);
/**
 * @swagger
 * /api/songs/{id}:
 *   put:
 *     summary: Update a song by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Perfect
 *               duration:
 *                 type: number
 *                 example: 240
 *     responses:
 *       200:
 *         description: Song updated successfully
 *       404:
 *         description: Song not found
 */
router.put("/:id", songController.updateSong);
/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Delete a song by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       204:
 *         description: Song deleted successfully
 *       404:
 *         description: Song not found
 */
router.delete("/:id", songController.deleteSong);

module.exports = router;