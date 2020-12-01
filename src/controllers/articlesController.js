import { successResponse } from '../utils/response';
import { Article, Review } from '../models';

const articlesController = {
  getAllArticles: async (req, res) => successResponse(res, {
    articles: [
      {
        title: 'article1',
        createdAt: new Date(),
        description: 'article1 description',
      },
      {
        title: 'article2',
        createdAt: new Date(),
        description: 'article2 description',
      },
    ],
  }),
  getUsersArticles: async (req, res) => successResponse(res, {
    articles: [
      {
        title: 'article1',
        createdAt: Date.now(),
        description: 'article1 description',
      },
    ],
  }),
  createArticle: async (req, res) => {
    const {
      user,
      body: {
        title,
        description,
        markdown,
      },
    } = req;

    const article = await Article.create({
      title,
      description,
      markdown,
      user: user._id,
    });

    return successResponse(res, { article });
  },
};

export default articlesController;
