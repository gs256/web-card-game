import Card from './Card'

export default class CardSlot {
    private _card: Card | null = null

    public get card(): Card | null {
        return this._card
    }

    public set card(value: Card | null) {
        this._card = value
    }

    public empty(): boolean {
        return this._card == null
    }
}
