export default class Card {
    public readonly id: number
    public readonly imageUrl: string

    constructor(id: number) {
        this.id = id
        this.imageUrl = 'https://via.placeholder.com/125x175'
    }
}
