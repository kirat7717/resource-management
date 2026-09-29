import mongoose from 'mongoose';

const tagSuggestionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index on key and value to prevent duplicate tag suggestions
tagSuggestionSchema.index({ key: 1, value: 1 }, { unique: true });

const TagSuggestion = mongoose.model('TagSuggestion', tagSuggestionSchema);
export default TagSuggestion;
