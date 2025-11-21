// Test script to verify Indian names generation
const indianNames = [
    "Aarav Patel", "Aarya Sharma", "Advik Singh", "Anika Gupta", "Arjun Reddy",
    "Dev Patel", "Dia Sharma", "Ishaan Kumar", "Kavya Reddy", "Krishna Verma",
    "Meera Patel", "Mohit Sharma", "Neha Singh", "Pranav Gupta", "Riya Verma",
    "Rohan Patel", "Saanvi Sharma", "Siddharth Kumar", "Tanvi Reddy", "Vihaan Verma"
];

// Function to generate a consistent index based on patientId
function generateNameFromId(patientId) {
    // Generate a consistent index based on patientId to always return the same name for the same patient
    let hash = 0;
    for (let i = 0; i < patientId.length; i++) {
        hash = ((hash << 5) - hash + patientId.charCodeAt(i)) & 0xffffffff;
    }

    // Use the hash to select a name from the list
    const index = Math.abs(hash) % indianNames.length;
    return indianNames[index];
}

// Test with sample patient IDs
const testIds = [
    "690774b4670903f6bab8f0b3",
    "690774b5670903f6bab8f0b5",
    "690774b5670903f6bab8f0b7",
    "691e01ac4e31556b4e529548",
    "691e01ac4e31556b4e52954d",
    "691e01ac4e31556b4e529552",
    "691e01ad4e31556b4e529557",
    "691e01ad4e31556b4e52955c",
    "691e01ad4e31556b4e529561",
    "691e01ad4e31556b4e529566"
];

console.log("Testing Indian names generation:");
testIds.forEach((id, index) => {
    const name = generateNameFromId(id);
    console.log(`Patient ${index + 1} (${id}): ${name}`);
});