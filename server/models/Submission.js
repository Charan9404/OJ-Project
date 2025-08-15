import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["python", "java", "cpp", "c++", "javascript"],
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "WRONG_ANSWER", "COMPILE_ERROR", "RUNTIME_ERROR", "TIME_LIMIT"],
      default: "PENDING",
    },
    stdout: {
      type: String,
      default: "",
    },
    stderr: {
      type: String,
      default: "",
    },
    compileError: {
      type: String,
      default: "",
    },
    metrics: {
      time: String,
      memory: String,
    },
  },
  {
    timestamps: true,
  },
)

const Submission = mongoose.model("Submission", submissionSchema)

export default Submission
