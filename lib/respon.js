exports.onlyGroup = (pushname) => {
  return `*Maaf ${pushname} Perintah ini hanya dapat digunakan di group*`;
};
exports.onlyAdmin = (pushname) => {
   return `*Maaf ${pushname} Perintah ini hanya dapat digunakan oleh admin group*`;
};
exports.botAdmin = (pushname) => {
   return `*Maaf ${pushname} Perintah ini hanya dapat digunakan ketika bot menjadi admin*`;
};
exports.notText = (prefix, cmd, pushname) => {
   return `*Maaf ${pushname}*\n\n_Parameter text belum dimasukan_\n\nex: ${prefix + cmd} yourtext `;
};
exports.wait = (prefix, cmd, pushname) => {
   return `\n\n\n             *Sedang diproses*               \n\n\n`;
};