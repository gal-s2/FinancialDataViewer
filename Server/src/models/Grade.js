const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema({
    symbol: { type: String, required: true, index: true },
    date: Date,
    gradingCompany: String,
    previousGrade: String,
    newGrade: String,
    action: String,
});

GradeSchema.index({ symbol: 1, date: 1, gradingCompany: 1 }, { unique: true });

module.exports = mongoose.model("Grade", GradeSchema);
