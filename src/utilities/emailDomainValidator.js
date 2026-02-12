const disposableDomains = require('disposable-email-domains');

// 1. Add your own custom domains here
const customBlacklist = [
  // --- 1. Generic Placeholders (Existing) ---
  'fake.com',
  'test.com',
  'example.com',
  'user.com',
  'xyz.com',

  // --- 2. High-Volume Spam Bot Domains (From your logs) ---
  'feanzier.com',
  'akixpres.com',
  'atinjo.com',
  'eubonus.com',
  'imfaya.com',
  'gopicta.com',
  'ixospace.com',
  'jparksky.com',
  'lesote.com',
  'supdrop.com',
  'dropmeon.com',
  'renakol.com',
  'senione.com',
  'mailinator.com',
  'veedraw.com',
  'videnox.com',
  'beautystoremax.com',
  'faircapride.com',
  'smclouda.com',
  'shagni.com',
  'temailz.com',
  'snapbx.com',
  'rosuper.com',
  'mekuron.com',
  'oudk.com',
  'lhook.com',
  'took.com',
  'hook.com',
  'mbox.re',
  'xkxkud.com',
  'intrusc.com',
  'zzloi.com',
  'xspiel.com',
  'weemmo.com',
  'uk.com',

  // --- 3. Typos & Invalid Formats (From your logs) ---
  'gamil.com',
  'gmai.com',
  'gail.com',
  'gmmahiiail.com',
  'gyahoo.com',
  'yagoo.com',
  'yaoo.com',
  'yao.com',
  'yoo.com',
  'yajo.com',
  'gmaol.com',
  'ghil.com',
  'gsil.com',
  'gsmil.com',
  'gjfil.com',
  'gok.com',
  'ouk.com',
  'outk.com',
  'outok.com',
  'oul.com',
  'ofk.com',
  'look.com',
  'hoo.com',
  'hail.com',
  'kail.com',
  'dmail.com',
  '6gmail.com',
  '5gmail.com',
  '4gmail.com',
  'ail.com',
  'xgho.com',
  'vhh.com',
  'fgj.com',
  'gdh.com',
  'ggj.com',
  'fgh.com',
  'xgg.com',
  'ghh.com',
  'gh.com',
  'gnsh.com',
  'senionwe.com',
  'senion4e.com'
];

// 2. Combine the lists (Standard Library + Your Custom List)
// We use a Set for faster performance (O(1) lookup speed)
const blockedDomains = new Set([...disposableDomains, ...customBlacklist]);

const validateEmailDomain = (value, helpers) => {
  if (!value) return value;

  // Extract domain
  const domain = value.split('@')[1];

  // Check if domain exists (case insensitive)
  if (domain && blockedDomains.has(domain.toLowerCase())) {
    return helpers.message('Use of disposable, temporary, or restricted email addresses is not allowed.');
  }

  return value;
};

module.exports = validateEmailDomain;