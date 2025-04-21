import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  newsImage: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  authorName: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String,
  },
}, {
  timestamps: true,
});

const News = mongoose.models.News || mongoose.model('News', newsSchema);

export default News; 