// pages/api/warranty.js

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { warrantyNumber } = req.body;

        // Process or validate the warranty number here.
        // For example purposes, let's assume it's valid if it contains 10 characters.
        if (warrantyNumber.length === 10) {
            // Simulate a successful lookup/validation
            res.status(200).json({ success: true, message: "Warranty number is valid.", data: { warrantyNumber } });
        } else {
            // Simulate a failed lookup/validation
            res.status(400).json({ success: false, message: "Warranty number is invalid. It must be 10 characters long." });
        }
    } else {
        // Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}