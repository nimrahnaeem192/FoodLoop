const FOOD_STATUS = Object.freeze({
  AVAILABLE: "available",
  RESERVED: "reserved",
  COLLECTED: "collected",
  EXPIRED: "expired",
});

const FOOD_LISTING_FIELDS = Object.freeze([
  "foodName",
  "category",
  "quantity",
  "pickupLocation",
  "availableFrom",
  "availableUntil",
  "expiryDate",
  "description",
  "status",
]);

module.exports = { FOOD_STATUS, FOOD_LISTING_FIELDS };
