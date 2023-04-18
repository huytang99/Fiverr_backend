import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
    if (!req.isSeller) {
        return next(createError(403, "Only sellers can create gigs"));
    }

    const newGig = new Gig({
        userId: req.userId,
        ...req.body,
    });

    try {
        const savedGig = await newGig.save();
        res.status(201).send(savedGig);
    } catch (err) {
        next(err);
    }
}

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            return next(createError(404, "Gig not found"));
        }
        if (req.userId !== gig.userId) {
            return next(createError(403, "You are not authorized to delete this gig"));
        }
        await Gig.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Gig deleted successfully" });
    } catch (err) {
        next(err);
    }
}

export const getGig = async (req, res, next) => {
    try {
      const gig = await Gig.findById(req.params.id);
      if (!gig) next(createError(404, "Gig not found!"));
      res.status(200).send(gig);
    } catch (err) {
      next(err);
    }
  };

export const getGigs = async (req, res, next) => {
  const q = req.query
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
    try {
      const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
      res.status(200).send(gigs);
    } catch (err) {
      next(err);
    }
  }