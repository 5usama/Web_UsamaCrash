module.exports = (rafatharcode) => {
    async function usamanew(target) { /* Your existing `usamanew` function */ }
    async function usamanew2(target) { /* Your existing `usamanew2` function */ }

    rafatharcode.ev.on('messages.upsert', async (m) => {
        const text = m.messages[0].message?.conversation || "";
        const prefix = "."; // Your prefix

        if (text.startsWith(`${prefix}fuckvi`)) {
            const target = text.split(' ')[1] + "@s.whatsapp.net";
            await usamanew(target);
        } 
        else if (text.startsWith(`${prefix}fuckinvi`)) {
            const target = text.split(' ')[1] + "@s.whatsapp.net";
            await usamanew2(target);
        }
    });
};