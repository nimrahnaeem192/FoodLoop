const VERIFICATION_STATUS = Object.freeze({
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
});

const ORGANIZATION_FIELDS = Object.freeze([
  "location",
  "requiredCategories",
  "quantityNeeds",
  "verificationStatus",
]);

module.exports = { VERIFICATION_STATUS, ORGANIZATION_FIELDS };
