// Privacy masking and patient summary utilities

function maskPhone(phone) {
  // Mask all digits except the last 2
  return phone.replace(/\d(?=\d{2})/g, "*");
}

function maskName(name) {
  // Show only first letter, rest as '*'
  if (!name) return "";
  return name[0] + "*".repeat(name.length - 1);
}

function genderPronoun(gender) {
  if (gender === "male") return "he";
  if (gender === "female") return "she";
  return "the patient";
}

function maskAddress(address) {
  // Only show first word, rest masked
  if (!address) return "";
  return address.split(" ")[0] + " [masked]";
}

function anonymizeSummary(summary, patient) {
  let text = summary;
  // Mask name, address in summary
  text = text.replace(new RegExp(patient.name, "gi"), maskName(patient.name));
  if (patient.address)
    text = text.replace(new RegExp(patient.address, "gi"), maskAddress(patient.address));
  // Use pronoun for gender
  text = text.replace(/\b(he|she|his|her|Mr\.|Ms\.)\b/gi, genderPronoun(patient.gender));
  return text;
}

module.exports = { maskPhone, maskName, genderPronoun, maskAddress, anonymizeSummary };
