// Word Database - Easy to modify and extend
const wordDatabase = {
    "t": [
        "asked", "baked", "brushed", "crossed", "danced", "fixed", "helped",
        "jumped", "kicked", "laughed", "looked", "missed", "passed", "pushed",
        "stopped", "talked", "walked", "watched", "wished", "worked",
        "cooked", "typed", "kissed", "washed", "finished", "liked", "mixed",
        "packed", "picked", "reached", "touched", "dressed", "pressed", "blessed"
    ],
    "d": [
        "aimed", "called", "cleaned", "closed", "filled", "gained", "joined",
        "lived", "moved", "opened", "played", "rained", "saved", "showed", 
        "stayed", "tried", "used", "viewed", "waved", "yelled",
        "amazed", "annoyed", "enjoyed", "belonged", "borrowed", "claimed",
        "damaged", "delivered", "explored", "followed", "happened", "imagined",
        "learned", "listened", "managed", "organized", "planned", "shared"
    ],
    "id": [
        "added", "created", "decided", "divided", "ended", "folded", "guided",
        "hated", "invited", "landed", "needed", "painted", "rested", "started",
        "tasted", "visited", "waited", "wanted", "wasted", "yielded",
        "accepted", "admitted", "attended", "collected", "connected", "counted",
        "downloaded", "educated", "expected", "graduated", "hunted", "imported",
        "insisted", "invested", "limited", "located", "printed", "protected"
    ]
};

// Additional word sets for different levels
const levelWords = {
    beginner: {
        t: wordDatabase.t.slice(0, 10),
        d: wordDatabase.d.slice(0, 10),
        id: wordDatabase.id.slice(0, 10)
    },
    intermediate: {
        t: wordDatabase.t.slice(10, 25),
        d: wordDatabase.d.slice(10, 25),
        id: wordDatabase.id.slice(10, 25)
    },
    advanced: {
        t: wordDatabase.t.slice(25),
        d: wordDatabase.d.slice(25),
        id: wordDatabase.id.slice(25)
    }
};

// Pronunciation rules and examples
const pronunciationRules = {
    t: {
        description: "Words ending in /t/ sound",
        rule: "When the base form ends in voiceless sounds: /p/, /k/, /f/, /s/, /ʃ/, /tʃ/, /θ/",
        examples: ["help → helped", "work → worked", "wash → washed"]
    },
    d: {
        description: "Words ending in /d/ sound", 
        rule: "When the base form ends in voiced sounds: /b/, /g/, /v/, /z/, /ʒ/, /dʒ/, /ð/, /m/, /n/, /ŋ/, /l/, /r/, vowel sounds",
        examples: ["play → played", "live → lived", "call → called"]
    },
    id: {
        description: "Words ending in /ɪd/ sound",
        rule: "When the base form ends in /t/ or /d/ sounds",
        examples: ["want → wanted", "need → needed", "visit → visited"]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wordDatabase, levelWords, pronunciationRules };
}
