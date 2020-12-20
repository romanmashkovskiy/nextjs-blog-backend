import { successResponse } from '../utils/response';
import { Article } from '../models';

const articlesController = {
  getAllArticles: async (req, res) => {
    const articles = await Article.paginate();

    return successResponse(res, articles);
  },
  getUsersArticles: async (req, res) => {
    const { user } = req;

    const articles = await Article
      .paginate({ user: user._id }, { populate: 'user' });

    return successResponse(res, articles);
  },
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
