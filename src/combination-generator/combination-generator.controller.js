import { generateValidCombinations } from "./combination-generator.service.js";

export const generateCombinations = async (req, res, next) => {
  try {
    const { items, length } = req.body;
    const combinations = await generateValidCombinations(items, length);
    res.status(200).json(combinations);
  } catch (error) {
    next(error);
  }
};
