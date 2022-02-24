import Card from './Card'
import CardSlot from './CardSlot'

const deck = [
    new Card(87012113),
    new Card(47752050),
    new Card(53386434),
    new Card(12176881),
    new Card(75999709),
    new Card(72678150),
    new Card(78608093),
    new Card(72402019),
    new Card(33925639),
    new Card(89003351),
    new Card(99606781),
    new Card(10383911),
    new Card(20857902),
    new Card(20462085),
    new Card(51469252),
    new Card(50181562),
    new Card(86273429),
    new Card(37040581),
    new Card(27632956),
    new Card(14015057),
    new Card(20794648),
    new Card(37829756),
    new Card(42866062),
    new Card(89887663),
    new Card(24946819),
    new Card(80937873),
    new Card(42138697),
    new Card(55252750),
    new Card(20566002),
    new Card(90962398)
]

export default class GameFacade {
    public static readonly deck = deck
    public static readonly cardRowWidth = 5

    private readonly _playerSlots: CardSlot[]
    private readonly _enemySlots: CardSlot[]
    private _playerCollection: Card[]
    private _enemyCollection: Card[]

    public get playerSlots(): CardSlot[] {
        return this._playerSlots
    }

    public get enemySlots(): CardSlot[] {
        return this._enemySlots
    }

    public get playerCollection(): Card[] {
        return this._playerCollection
    }

    public get enemyCollection(): Card[] {
        return this._enemyCollection
    }

    public onPlayerMoveMade?: () => void
    public onEnemyMoveMade?: () => void

    constructor() {
        console.log('facade ctor')
        this._playerSlots = getEmptyCardRow()
        this._enemySlots = getEmptyCardRow()
        this._playerCollection = deck.slice(0, 5)
        this._enemyCollection = deck.slice(5, 10)
    }

    public getAllowedMoves(cardId: number): number[] {
        const moves: number[] = []
        this._playerSlots.forEach((slot, index) => {
            if (slot.empty()) moves.push(index)
        })
        return moves
    }

    public move(cardId: number, slotIndex: number): boolean {
        if (!this._playerCollection.find((card) => card.id === cardId)) return false
        if (!this.getAllowedMoves(cardId).includes(slotIndex)) return false
        this.placeCard(cardId, slotIndex)
        this.onPlayerMoveMade?.()
        return true
    }

    private placeCard(cardId: number, slotIndex: number) {
        const index = this._playerCollection.findIndex((card) => card.id === cardId)
        if (index < 0) return
        this._playerSlots[slotIndex].card = this._playerCollection[index]
        this._playerCollection.splice(index, 1)
    }
}

function getEmptyCardRow(): CardSlot[] {
    const result: CardSlot[] = []
    for (let i = 0; i < GameFacade.cardRowWidth; i++) result.push(new CardSlot())
    return result
}
