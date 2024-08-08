require('dotenv').config();

const ownerIds = [
    '792168652563808306', // ivcicles
    '1223639595745542257', // koholaz
];

const staffIds = [
    '792168652563808306', // ivcicles
    '813580656617586688', // datmrdolphin
    '746012469578956820', // sxra1x
];

const config = {
    token: process.env.TOKEN,
    prefix: '>',
    owners: ownerIds,
    staff: staffIds,
};

module.exports = config;