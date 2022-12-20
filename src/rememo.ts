import fs from 'fs'

export type Word = {
    tr: string,
    or: string,
    points: number,
    known: boolean,
    index: number,
    lastCorrect?: number,
}

export default class Rememo {
    private readonly FILE_PATH = 'data/se.json'
    private readonly FILE_PATH_FLAGS = 'data/flags.logs'

    private allWords: Word[] = [];
    private words: Word[] = [];
    private currentNDone = 0;

    constructor() {
        this.reload();
    }

    private check(word: Word, text: string): boolean {
        return word.or.toLocaleLowerCase().trim() === text.toLowerCase().trim();
    }

    public reload() {
        this.allWords = JSON.parse(fs.readFileSync(this.FILE_PATH, 'utf8'));
        this.words = this.allWords.filter(w => w.known);
    }

    public flag(word: Word): void {
        fs.appendFileSync(this.FILE_PATH_FLAGS, `${word?.tr}\n`);
    }

    public nextWord(): Word {
        return this.words
            .filter(w => !w.lastCorrect || w.lastCorrect <= this.currentNDone - 10)
            .reduce((a, b) => a.points <= b.points ? a : b, { points: 1.1 } as Word);
    }

    public handleAnswer(wordIndex: number, text: string): [boolean, string] {
        const word = this.words.find(w => w.index === wordIndex);
        if (!word) {
            return [true, '⚠️ Error! Skipping this word'];
        }

        if (this.check(word, text)) {
            const pp = (1 - word.points) / 2;
            word.points += pp > 0.25 ? 0.25 : pp;
            word.lastCorrect = this.currentNDone;
            this.currentNDone++;
            return [true, `🟩 Correct! [${word!.points.toPrecision(2)}]<code>${word?.or}</code>`];
        } else {
            word.points /= 3;
            if (text === 'dc') {
                return [true, `🟨 All correct answers are:\n<code>${word?.or}</code>`];
            } else {
                return [false, '🟥 Wrong!'];
            }
        }
    }

    public updateFile(): void {
        fs.writeFileSync(this.FILE_PATH, JSON.stringify(this.allWords, null, 2));
    }

    public nextToLoad(n: number): { tr: string, index: number }[] {
        const words = this.allWords.filter(w => !w.known);
        return words.slice(0, n).map(w => ({ tr: w.or, index: w.index }));
    }

    public loadWords(indexes: number[]): void {
        indexes.forEach(i => { this.allWords[i].known = true; });
        this.updateFile();
        this.reload();
    }

}
