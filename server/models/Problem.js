import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [String],
    examples: [
      {
        input: String,
        output: String,
      },
    ],
    constraints: [String],
    starterCode: String,
    solution: String,
  },
  { timestamps: true }
);

export default mongoose.model("Problem", ProblemSchema);
