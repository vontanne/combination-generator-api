export function validateRequestFormat(req, res, next) {
  const { items, length } = req.body;

  if (
    !Array.isArray(items) ||
    !items.every((item) => typeof item === "number" && Number.isFinite(item))
  ) {
    return res.status(400).json({
      error: "Invalid format: 'items' must be an array of valid numbers",
    });
  }

  if (typeof length !== "number" || !Number.isFinite(length)) {
    return res
      .status(400)
      .json({ error: "Invalid format: 'length' must be a valid number" });
  }

  next();
}
