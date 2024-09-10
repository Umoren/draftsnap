import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing form data' })
        }

        const file = files.image?.[0]; // formidable v3 returns an array for each field
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        try {
            const imageBuffer = fs.readFileSync(file.filepath)
            const base64Image = imageBuffer.toString('base64')

            const response = await axios.post('https://api.imgur.com/3/image', {
                image: base64Image,
                type: 'base64',
                title: fields.title?.[0], // formidable v3 returns an array for each field
            }, {
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                },
            })

            res.status(200).json({ link: response.data.data.link })
        } catch (error) {
            console.error('Error uploading to Imgur:', error)
            res.status(500).json({ error: 'Error uploading to Imgur' })
        }
    })
}