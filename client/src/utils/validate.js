import constants from "../constants";

export const validate = (record, showTournament, type) => {
  const prompt = {
    error: true,
    message: "Error",
  };
  if (!record.sportName) {
    prompt.message = "Please Select Sports";
  } else if (!record.compName) {
    prompt.message = "Please Select Competition";
  } else if (showTournament && !record.tournamentName) {
    prompt.message = "Please Select Tournament";
  } else if (!record.matchName) {
    prompt.message = "Please Select Match";
  } else if (type === constants.FEATURED && record.propositions.length === 0) {
    prompt.message = "Please Add Some Propositions";
  } else if (
    type === constants.POPULAR &&
    (Number(record.minLegs) <= 0 ||
    Number(record.maxLegs) <= 0 ||
    Number(record.minPrice) <= 0 ||
    Number(record.maxPrice) <= 0 ||
    Number(record.numberOfBets) <= 0)
  ) {
    prompt.message = "Values cant be 0 or less than 0";
  } else if (type === constants.POPULAR && Number(record.minLegs) >= Number(record.maxLegs)) {
    prompt.message =
      "Min No of Legs can't be greater than or equal to Max No of Legs";
  } else if (type === constants.POPULAR && Number(record.minPrice) >= Number(record.maxPrice)) {
    prompt.message = "Min Price can't be greater than or equal to Max Price";
  } else {
    prompt.error = false;
  }

  return prompt;
};
