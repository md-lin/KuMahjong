import mongoose from "mongoose"

export enum Category {
    MATH = "Math",
    SCIENCE = "Science",
    MUSIC = "Music"
}

export interface IQuestion {
    question: string,
    hint?: string,
    answer: string,
    category: Category
}

export const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    hint: {
        type: String
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: Category,
        required: true
    }
})

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;