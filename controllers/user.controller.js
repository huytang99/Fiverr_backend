import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        if(req.userId !== user._id.toString()) {
            return next(createError(403, "You are not authorized to delete other users"));

        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    res.status(200).send(user);
  };