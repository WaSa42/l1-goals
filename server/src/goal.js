import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    minute: {
        type: String,
        required: true
    },
    player: {
        type: String,
        unique: true,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

export default mongoose.model('Goal', GoalSchema);
