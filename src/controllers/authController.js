import { successResponse } from '../utils/response';
import { User } from '../models';
import APIError from '../utils/APIError';
import { setTokenCookie, removeTokenCookie } from '../utils/auth-cookies';

const authController = {
  register: async (req, res) => {
    const { userName, email, password } = req.body;

    const user = await User.create({ userName, email, password });
    const token = await user.getToken();

    setTokenCookie(res, token);

    return successResponse(res, {
      user,
    });
  },

  login: async (req, res) => {
    const { user } = req;

    const token = await user.getToken();

    setTokenCookie(res, token);

    return successResponse(res, {
      user,
    });
  },

  getMe: async ({ user }, res) => successResponse(res, {
    user,
  }),

  confirmEmail: async (req, res) => {
    const { user, body: { code } } = req;

    if (user.isConfirmed) {
      throw new APIError('User already confirmed.', 422);
    }

    if (!user.verifyConfirmEmailCode(code)) {
      throw new APIError('Confirmation code is incorrect.', 422);
    }

    user.confirmEmailCode = null;
    user.isConfirmed = true;

    await user.save();

    return successResponse(res, { user });
  },

  sendConfirmEmailCode: async (req, res) => {
    const { user } = req;

    if (user.isConfirmed) {
      throw new APIError('User already confirmed.', 422);
    }

    await user.sendConfirmEmailCode();

    return successResponse(res, { message: 'Confirm email code was successfully sent.' });
  },

  resetPassword: async (req, res) => {
    const { user } = req;

    await user.sendResetPasswordCode();

    return successResponse(res, { message: 'Reset password code was successfully sent.' });
  },

  restorePassword: async (req, res) => {
    const { user, body: { code, password } } = req;

    if (!user.verifyResetPasswordCode(code)) {
      throw new APIError('Reset password code is incorrect.', 422);
    }

    user.resetPasswordCode = null;
    user.password = password;

    await user.save();

    const token = await user.getToken();

    setTokenCookie(res, token);

    return successResponse(res, {
      user,
    });
  },

  logout: async (req, res) => {
    removeTokenCookie(res);
    return successResponse(res, { message: 'Logout success' });
  },
};

export default authController;
