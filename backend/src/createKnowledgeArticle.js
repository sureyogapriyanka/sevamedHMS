const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const KnowledgeArticle = require('./models/KnowledgeArticle');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Create the knowledge article
const createKnowledgeArticle = async () => {
    try {
        // Connect to database
        await connectDB();

        // Article data
        const articleData = {
            title: "Preventive Healthcare: Why Early Checks Can Literally Save Your Life",
            content: `In today's fast-moving world, most people visit a doctor only when something feels wrong. But modern healthcare is shifting toward a smarter approach — preventive healthcare. Instead of waiting for an illness to show symptoms, preventive care focuses on detecting risks early, strengthening long-term health, and reducing the chances of serious medical problems.

What Is Preventive Healthcare?

Preventive healthcare involves regular check-ups, screenings, vaccinations, and lifestyle monitoring that help identify potential health issues before they become serious. Rather than treating diseases after they develop, the goal is to stop or delay them from happening in the first place.

Why Preventive Care Matters
✔ Early Detection Saves Lives

Many conditions like diabetes, hypertension, thyroid disorders, and certain cancers develop silently. Simple tests — like blood sugar checks, blood pressure monitoring, or routine blood panels — can catch early warning signs before they turn severe.

✔ Reduces Long-Term Costs

Treating a disease in advanced stages is far more expensive than early management. Preventive care reduces hospital visits, complex treatments, and costly emergencies.

✔ Supports a Longer, Healthier Life

Regular check-ups allow you to track your health, notice changes, and make timely lifestyle adjustments. Healthy habits combined with preventive care significantly increase both life expectancy and quality of life.

✔ Builds Stronger Immunity

Vaccinations and proper nutrition are essential parts of preventive health. They protect the body from infections and chronic illnesses, especially in children, older adults, and individuals with weak immune systems.

Key Preventive Tests Everyone Should Consider

While individual needs differ, health experts recommend these screenings:

Annual blood tests (CBC, lipid profile, sugar levels)

Blood pressure check

BMI & obesity evaluation

Thyroid function test

Vaccination updates

Dental and eye examinations

Women-specific screenings (pap smear, breast exam)

Men-specific screenings (prostate evaluation after 40)

Lifestyle Preventive Care

Beyond medical tests, daily habits play a huge role in preventing diseases. Focus on:

Balanced, nutrient-rich diet

At least 30 minutes of exercise

7–8 hours of sleep

Stress management

Regular hydration

Avoiding smoking and excessive alcohol

Conclusion

Preventive healthcare is not a luxury — it's a necessity. With early detection, routine screenings, and small lifestyle changes, you can avoid major health complications and live a stronger, happier life. At Sevamed, our goal is to empower you with reliable health information and services that keep you in control of your well-being.`,
            author: "Sevamed Medical Team",
            category: "Preventive Care",
            tags: ["preventive care", "health checkups", "early detection", "wellness", "health tips"],
            viewCount: 0
        };

        // Create the article
        const article = new KnowledgeArticle(articleData);
        const savedArticle = await article.save();
        console.log(`Successfully created knowledge article: ${savedArticle.title}`);
        console.log(`Article ID: ${savedArticle._id}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating knowledge article:', error);
        process.exit(1);
    }
};

// Run the function
createKnowledgeArticle();