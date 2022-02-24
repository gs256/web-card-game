import { ReactNode, useEffect, useState } from 'react'
import Card from './Card'
import CardSlot from './CardSlot'
import GameFacade from './GameFacade'

export default function Game() {
    const facade = new GameFacade()

    return (
        <div className='game'>
            <Table facade={facade} />
        </div>
    )
}

class CardModel {
    public readonly id: number
    public readonly imageUrl: string
    public selected: boolean
    public hidden: boolean

    constructor(card: Card) {
        this.id = card.id
        this.imageUrl = card.imageUrl
        this.selected = false
        this.hidden = false
    }
}

class SlotModel {
    public card: CardModel | null = null
    public highlighted: boolean

    constructor(slot: CardSlot) {
        if (slot.card) this.card = new CardModel(slot.card)
        this.highlighted = false
    }
}

function Table(props: { facade: GameFacade }) {
    const facade = props.facade

    const [inPlacingMode, setInPlacingMode] = useState(false)
    const [playerSlots, setPlayerSlots] = useState(
        facade.playerSlots.map((slot) => new SlotModel(slot))
    )
    const [enemySlots, setEnemySlots] = useState(
        facade.enemySlots.map((slot) => new SlotModel(slot))
    )
    const [playerCollection, setPlayerCollection] = useState(
        facade.playerCollection.map((card) => new CardModel(card))
    )
    const [selectedCard, setSelectedCard] = useState<CardModel | null>(null)

    facade.onPlayerMoveMade = () => {
        setPlayerSlots(facade.playerSlots.map((slot) => new SlotModel(slot)))
        setPlayerCollection(facade.playerCollection.map((card) => new CardModel(card)))
        setSelectedCard(null)
    }

    function onCardSlotClicked(slotIndex: number) {
        console.log('clicked on', slotIndex)
        if (!selectedCard) return
        facade.move(selectedCard.id, slotIndex)
    }

    function onCardClicked(card: CardModel, cardIndex: number) {
        setSelectedCard(card.selected ? null : card)
    }

    useEffect(() => {
        setPlayerCollection(
            playerCollection.map((card) => {
                card.selected = card === selectedCard
                return card
            })
        )
        setInPlacingMode(!!playerCollection.find((card) => card.selected))
    }, [selectedCard])

    useEffect(() => {
        const moves = selectedCard ? facade.getAllowedMoves(selectedCard.id) : []
        setPlayerSlots(
            playerSlots.map((slot, index) => {
                slot.highlighted = moves.includes(index)
                return slot
            })
        )
    }, [inPlacingMode])

    return (
        <div className='game-table'>
            <div className='table-card-area'>
                <CardRow cardRow={enemySlots} ownedByPlayer={false} onSlotClicked={() => {}} />
                <CardRow
                    cardRow={playerSlots}
                    ownedByPlayer={true}
                    onSlotClicked={onCardSlotClicked}
                />
            </div>
            <PlayerCardCollection>
                {playerCollection.map((card, index) => (
                    <CardView
                        card={card}
                        key={index}
                        interactable={true}
                        onClicked={() => onCardClicked(card, index)}
                    />
                ))}
            </PlayerCardCollection>
            <CardDeck>{/* TODO: Add dummy cards */}</CardDeck>
        </div>
    )
}

function CardRow(props: {
    cardRow: SlotModel[]
    ownedByPlayer: boolean
    onSlotClicked: (index: number) => void
}) {
    return (
        <div className='table-card-row'>
            {props.cardRow.map((slot, index) => (
                <CardPlaceholder
                    key={index}
                    model={slot}
                    highlighted={props.ownedByPlayer && slot.highlighted}
                    onClick={() => props.onSlotClicked(index)}
                />
            ))}
        </div>
    )
}

function CardPlaceholder(props: { model: SlotModel; highlighted: boolean; onClick: () => void }) {
    const card = props.model.card

    return (
        <div
            className={`table-card-placeholder${props.highlighted ? ' highlighted' : ''}`}
            onClick={props.onClick}
        >
            {card && <CardView card={card} interactable={false} />}
        </div>
    )
}

function CardDeck(props: { children?: ReactNode }) {
    return (
        <div className='table-card-deck'>
            <div className='card-deck-card-container'>{props.children}</div>
        </div>
    )
}

function CardView(props: { card: CardModel; interactable: boolean; onClicked?: () => void }) {
    const [hovered, setHovered] = useState(false)

    function onClicked() {
        props.onClicked?.()
    }

    function onMouseEnter() {
        setHovered(true)
    }

    function onMouseLeave() {
        setHovered(false)
    }

    return (
        <div
            className={`game-card ${props.card.selected ? 'selected' : ''} ${
                hovered ? 'zoomed-in' : ''
            } ${props.interactable ? 'interactable' : ''}`}
            onClick={onClicked}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                backgroundImage: `url("${props.card.imageUrl}")`
            }}
        >
            {props.card.id.toString()}
        </div>
    )
}

function PlayerCardCollection(props: { children?: ReactNode[] }) {
    return (
        <div className={'table-player-card-collection-container'}>
            <div className='table-player-card-collection'>
                {props.children?.map((child, index) => (
                    <div key={index} style={{ marginRight: '10px', marginLeft: '10px' }}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}
