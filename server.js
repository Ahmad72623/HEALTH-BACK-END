const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express(); 
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/calculate-risk", (req, res) => {
    console.log("Received data:", req.body);

    let riskScore = 0;

    // Age Risk Calculation
    if (req.body.age < 30) riskScore += 0;
    else if (req.body.age < 45) riskScore += 10;
    else if (req.body.age < 60) riskScore += 20;
    else riskScore += 30;
    console.log("Age Points:", riskScore);

    // BMI Risk Calculation
    if (req.body.bmi < 25) riskScore += 0;
    else if (req.body.bmi < 30) riskScore += 30;
    else riskScore += 75;
    console.log("BMI Points:", riskScore);

    // Blood Pressure Risk Calculation (Apply ONLY the highest category)
    let bpRisk = 0;
    if (req.body.systolic > 180 || req.body.diastolic > 120) {
        bpRisk = 100; // Hypertensive Crisis
    } else if (req.body.systolic >= 140 || req.body.diastolic >= 90) {
        bpRisk = 75; // Stage 2
    } else if (req.body.systolic >= 130 || req.body.diastolic >= 80) {
        bpRisk = 30; // Stage 1
    } else if (req.body.systolic >= 120 && req.body.diastolic < 80) {
        bpRisk = 15; // Elevated
    } else {
        bpRisk = 0; // Normal
    }
    riskScore += bpRisk;
    console.log("Blood Pressure Points:", riskScore);

    // Family History Risk Calculation
    let familyRisk = 0;
    if (req.body.familyHistory.includes("diabetes")) familyRisk += 10;
    if (req.body.familyHistory.includes("cancer")) familyRisk += 10;
    if (req.body.familyHistory.includes("alzheimers")) familyRisk += 10;
    
    riskScore += familyRisk;
    console.log("Family History Points:", riskScore);

    // Determine risk category
    let riskCategory = "";
    if (riskScore <= 20) riskCategory = "Low Risk";
    else if (riskScore <= 50) riskCategory = "Moderate Risk";
    else if (riskScore <= 75) riskCategory = "High Risk";
    else riskCategory = "Uninsurable";

    console.log("Final Calculated Risk:", { riskScore, riskCategory });
    res.json({ riskScore, riskCategory });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
